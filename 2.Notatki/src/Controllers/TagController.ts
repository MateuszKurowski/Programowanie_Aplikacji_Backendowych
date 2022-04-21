import { Response, Request } from 'express'
import { GetTagById, IsTagExist, Tag } from '../entity/tag'
import { CheckDatabaseLocation } from '../interfaces/database'
import { CheckToken } from '../utility/token'
const database = CheckDatabaseLocation()

// Odczytanie listy tagów
exports.Tag_Get_All = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const tags = await database.downloadTags()
	if (tags.length > 0) {
		res.status(200).send(tags)
	} else res.status(404).send('Nie ma żadnych tagów.')
}

// Odczytanie tagu
exports.Tag_Get = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const tagId = parseInt(req.params.id)
	const tag = GetTagById(tagId)
	if (!tag) res.status(404).send('Nie odnaleziono tagu z podanym ID.')
	else res.status(200).send(tag)
}

// Utworzenie tagu
exports.Tag_Post = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const name: string = req.body.name

	if (!name) {
		res.status(400).send('Podano niewłaściwy tag. Proszę uzupełnić nazwę.')
		return
	}

	const tag = await IsTagExist(name)
	if (!tag) {
		res.status(500).send('Nieoczekiwany błąd. Skontatkuj się z adminsitratorem')
		return
	}

	res.status(201).send('Utworzono nowy tag o ID: ' + tag.id)
}

// Modyfikacja tagu
exports.Tag_Put = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const tagId = parseInt(req.params.id)
	const tag = await GetTagById(tagId)

	if (!tag) {
		res.status(404).send('Nie odnaleziono tagu z podanym ID.')
		return
	}

	if (req.body.name != null) {
		tag.name = req.body.name
	}
	tag.Save()
	res.status(204).send(tag)
}

// Usunięcie tagu
exports.Tag_Delete = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const tagId = parseInt(req.params.id)
	const tags = await database.downloadTags()
	const index = tags.findIndex(x => x.id == tagId)
	if (tags[index] != null) {
		tags.splice(index, 1)
		await database.saveTags(tags)
		res.status(204).send('Tag został usunięty.')
	} else res.status(400).send('Nie odnaleziono tagu z podanym ID.')
}
