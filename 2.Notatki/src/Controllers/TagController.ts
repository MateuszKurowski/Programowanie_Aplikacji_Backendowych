import { Response, Request } from 'express'
import { Tag } from '../entity/tag'
import { CheckDatabaseLocation } from '../interfaces/database'
import { CheckToken } from '../utility/token'
const database = CheckDatabaseLocation()

// Odczytanie listy tagów
exports.Tag_Get_All = async function (req: Request, res: Response) {
	console.log('Pobieram liste tagów..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const tags = await database.downloadTags()
	if (tags.length > 0) {
		console.log(req.body)
		res.status(200).send(tags)
	} else res.status(404).send('Nie ma żadnych tagów.')
}

// Odczytanie tagu
exports.Tag_Get = async function (req: Request, res: Response) {
	console.log('Pobranie tagu..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const tags = await database.downloadTags()
	const tag = tags.find(x => x.id == id)
	if (tag == null) res.status(404).send('Nie odnaleziono tagu z podanym ID.')
	else res.status(200).send(tag)
}

// Utworzenie tagu
exports.Tag_Post = async function (req: Request, res: Response) {
	console.log('Tworzenie tagu..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const name: string = req.body.name

	if (name == null) {
		res.status(400).send('Podano niewłaściwy tag. Proszę uzupełnić nazwę.')
		return
	}

	const tags = await database.downloadTags()
	const sameTag = tags.find(x => x.name?.toLocaleLowerCase() == name.toLocaleLowerCase().trim())
	if (sameTag != null) {
		res.status(400).send('Podany tag już istnieje.')
		return
	}

	const tag = new Tag(name.trim())
	tags.push(tag)
	await database.saveTags(tags)

	const index = tags.findIndex(x => x.id == tag.id)
	res.status(201).send('Utworzono nowy tag o ID: ' + tag.id + ' (' + index + ')')
}

// Modyfikacja tagu
exports.Tag_Put = async function (req: Request, res: Response) {
	console.log('Edycja tagu..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const tags = await database.downloadTags()
	const index = tags.findIndex(x => x.id == id)
	const tag = tags[index]

	if (tag == null) {
		res.status(404).send('Nie odnaleziono tagu z podanym ID.')
		return
	}

	if (req.body.name != null) {
		tag.name = req.body.name
	}

	tags[index] = tag
	await database.saveTags(tags)

	res.status(204).send(tag)
}

// Usunięcie tagu
exports.Tag_Delete = async function (req: Request, res: Response) {
	console.log('Usuwanie tagu..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const tags = await database.downloadTags()
	const index = tags.findIndex(x => x.id == id)
	if (tags[index] != null) {
		tags.splice(index, 1)
		await database.saveTags(tags)
		res.status(204).send('Tag został usunięty.')
	} else res.status(400).send('Nie odnaleziono tagu z podanym ID.')
}
