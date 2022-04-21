import { Response, Request } from 'express'
import { userInfo } from 'os'
import { GetNoteById, GetNotesByUserId, Note } from '../entity/note'
import { IsTagExist, Tag } from '../entity/tag'
import { CheckDatabaseLocation } from '../interfaces/database'
import { CheckToken, DownloadPaylod } from '../utility/token'
const database = CheckDatabaseLocation()

// Odczytanie notatek zalogowanego użytkownika
exports.User_Get_By_User = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!)
	const userNotes = await GetNotesByUserId(userId)

	if (userNotes && userNotes.length > 0) res.status(200).send(userNotes)
	else res.status(404).send('Nie posiadasz żadnych notatek.')
}

exports.User_Get_By_User_Public = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!)
	const userNotes = await GetNotesByUserId(userId)
	if (!userNotes) {
		res.status(404).send('Nie posiadasz żadnych publicznych notatek')
		return
	}

	const userNotesPublic = userNotes.filter(function (Note) {
		return Note.access == 'Public'
	})

	if (userNotesPublic && userNotesPublic.length > 0) res.status(200).send(userNotesPublic)
	else res.status(404).send('Nie posiadasz żadnych publicznych notatek')
}

exports.User_Get_By_User_Private = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!)
	const userNotes = await GetNotesByUserId(userId)
	if (!userNotes) {
		res.status(404).send('Nie posiadasz żadnych publicznych notatek')
		return
	}

	const userNotesPrivate = userNotes.filter(function (Note) {
		return Note.access == 'Private'
	})

	if (userNotesPrivate && userNotesPrivate.length > 0) res.status(200).send(userNotesPrivate)
	else res.status(404).send('Nie posiadasz żadnych prywatnych notatek')
}

// Odczytanie notatki
exports.Note_Get = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const noteId = parseInt(req.params.id)
	const note = GetNoteById(noteId)
	if (!note) res.status(404).send('Nie odnaleziono notatki z podanym ID.')
	else res.status(200).send(note)
}

// Utworzenie notatki
exports.Note_Post = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const title = req.body.title
	const content = req.body.content
	if (title == null && content == null) {
		res.status(400).send('Podano niewłaściwą notatke. Proszę uzupełnić tytuł i zawratość.')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!)

	const note = new Note(title, content, userId)
	const sendingTags = req.body.tags?.split(',')
	let noteTags: Tag[] = []
	if (sendingTags?.length > 0) {
		sendingTags.forEach(async function (tagName: string) {
			const tag = await IsTagExist(tagName)
			if (tag) noteTags.push(tag)
		})
		note.tags = noteTags
	}
	note.Save()

	res.status(201).send('Utworzono nową notatkę o ID: ' + note.id)
}

// Modyfikacja notatki
exports.Note_Put = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const note = await GetNoteById(id)

	if (note == null) {
		res.status(404).send('Nie odnaleziono notatki z podanym ID.')
		return
	}

	if (req.body.title != null) {
		note.title = req.body.title
	}

	if (req.body.content != null) note.content = req.body.content

	if (req.body.tagsNames != null) {
		const sendingTags = req.body.tags?.split(',')
		let noteTags: Tag[] = []
		if (sendingTags?.length > 0) {
			sendingTags.forEach(async function (tagName: string) {
				const tag = await IsTagExist(tagName)
				if (tag) noteTags.push(tag)
			})
			note.tags = noteTags
		}
	}

	if (req.body.access != null) {
		const access = req.body.access
		switch (access.toLower().Trim()) {
			case 'public':
				note.access = 'Public'
				break
			case 'private':
				note.access = 'Private'
				break
			default:
				console.log('Nie udało się zmienić dostępności notatki.')
		}
	}

	note.Save()
	res.status(204).send(note)
}

// Usunięcie notatki
exports.Note_Delete = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const noteId = parseInt(req.params.id)
	const note = await GetNoteById(noteId)
	if (!note) {
		res.status(404).send('Nie odnaleziono notatki z podanym ID.')
		return
	}
	const notes = await database.downloadNotes()
	const index = notes?.findIndex(x => x.id == note?.id)
	notes.splice(index, 1)
	await database.saveNotes(notes)
	res.status(204).send('Notatka została usunięta.')
}

//#region Admin
// Odczytanie listy wszystkich notatek
exports.Note_Get_All = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const notes = await database.downloadNotes()
	if (notes.length > 0) res.status(200).send(notes)
	else res.status(404).send('Nie ma żadnych notatek.')
}

// Odczytanie listy notatek podanego użytkownika
exports.Note_Get_By_User_ID = async function (req: Request, res: Response) {
	if (!CheckToken(req)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const userId = parseInt(req.params.id)
	const userNotes = await GetNotesByUserId(userId)
	if (!userNotes) res.status(404).send('Nie odnalzeiono podanego użytkownika.')
	else if (userNotes.length == 0) res.status(404).send('Podany użytkownik nie posiada notatke.')
	else res.status(200).send(userNotes)
}
