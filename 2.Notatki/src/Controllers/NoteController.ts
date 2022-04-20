import { Response, Request } from 'express'
import { Note } from '../entity/note'
import { Tag } from '../entity/tag'
import { CheckDatabaseLocation } from '../interfaces/database'
import { CheckToken } from '../utility/token'
const database = CheckDatabaseLocation()

// Odczytanie notatek zalogowanego użytkownika
exports.User_Get_By_User = async function (req: Request, res: Response) {
	throw new Error('Nie zaimplementowane')
}

// Odczytanie notatki
exports.Note_Get = async function (req: Request, res: Response) {
	console.log('Pobranie notatki..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const notes = (await database.downloadNotes()) as Note[]
	const note = notes.find(x => x.id == id)
	if (note == null) res.status(404).send('Nie odnaleziono notatki z podanym ID.')
	else res.status(200).send(note)
}

// Utworzenie notatki
exports.Note_Post = async function (req: Request, res: Response) {
	console.log('Tworzenie notatki..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const notes: Note[] = await database.downloadNotes()
	const tags = await database.downloadTags()

	const title = req.body.title
	const content = req.body.content
	if (title == null && content == null) {
		res.status(400).send('Podano niewłaściwą notatke. Proszę uzupełnić tytuł i zawratość.')
		return
	}
	const note = new Note(title, content)

	const tagsNames = req.body.tags?.split(',')
	let noteTags: Tag[] = []
	if (tagsNames?.length > 0) {
		tagsNames.forEach((tagName: string) => {
			let existingTag = tags.find(x => x.name.toLowerCase() == tagName.toLowerCase().trim())
			if (existingTag == null) {
				existingTag = new Tag(tagName.trim())
				tags.push(existingTag)
			}
			noteTags.push(existingTag)
		})
		note.tags = noteTags
	}
	notes.push(note)
	//await database.saveNotes(notes)
	//await database.saveTags(tags)

	const index = notes.findIndex(x => x.id == note.id)
	res.status(201).send('Utworzono nową notatkę o ID: ' + note.id + ' (' + index + ')')
}

// Modyfikacja notatki
exports.Note_Put = async function (req: Request, res: Response) {
	console.log('Edycja notatki..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const notes = await database.downloadNotes()
	const tags = await database.downloadTags()
	const index = notes.findIndex(x => x.id == id)
	const note = notes[index]

	if (note == null) {
		res.status(404).send('Nie odnaleziono notatki z podanym ID.')
		return
	}

	if (req.body.title != null) {
		note.title = req.body.title
	}

	if (req.body.content != null) note.content = req.body.content

	if (req.body.tagsNames != null) {
		const tagsNames = req.body.tagsNames.split(',')
		let noteTags: Tag[] = []
		tagsNames.forEach((tagName: string) => {
			let existingTag = tags.find(x => x.name.toLowerCase() == tagName.toLowerCase().trim())
			if (existingTag == null) {
				existingTag = new Tag(tagName.trim())
				tags.push(existingTag)
			}
			noteTags.push(existingTag)
		})
		note.tags = noteTags
	}
	notes.push(note)
	//await database.saveNotes(notes)
	//await database.saveTags(tags)

	notes[index] = note
	res.status(204).send()
}

// Usunięcie notatki
exports.Note_Delete = async function (req: Request, res: Response) {
	console.log('Usuwanie notatki..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const notes = await database.downloadNotes()
	const index = notes.findIndex(x => x.id == id)
	if (notes[index] != null) {
		notes.splice(index, 1)
		await database.saveNotes(notes)
		res.status(204).send('Notatka została usunięta.')
	} else res.status(400).send('Nie odnaleziono notatki z podanym ID.')
}

//#region Admin
// Odczytanie listy wszystkich notatek
exports.Note_Get_All = async function (req: Request, res: Response) {
	console.log('Pobieram liste notatek..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const users = await database.downloadUsers()
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const notes = await database.downloadNotes()
	if (notes.length > 0) res.status(200).send(notes)
	else res.status(404).send('Nie ma żadnych notatek.')
}

// Odczytanie listy notatek podanego użytkownika
exports.Note_Get_By_User_ID = async function (req: Request, res: Response) {
	throw new Error('Nie zaimplementowano')
}
