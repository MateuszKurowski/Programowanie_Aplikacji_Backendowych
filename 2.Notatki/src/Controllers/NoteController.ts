import { Response, Request } from 'express'
import { monitorEventLoopDelay } from 'perf_hooks'
import { GetNoteById, GetNotes, GetNotesByUserId, GetSharedNotesByUserId, Note } from '../entity/note'
import { IsTagExist, Tag } from '../entity/tag'
import { GetUserById, GetUsers } from '../entity/user'
import { CheckDatabaseLocation } from '../interfaces/database'
import { CheckToken, DownloadPaylod } from '../utility/token'
const database = CheckDatabaseLocation()

// Odczytanie notatek zalogowanego użytkownika
exports.Note_Get_By_User = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!).Id
	const userNotes = await GetNotesByUserId(userId)

	if (userNotes && userNotes.length > 0) res.status(200).send(userNotes)
	else res.status(204).send('Nie posiadasz żadnych notatek.')
}

// Odczytanie notatek publicznych zalogowanego użytkownika
exports.Note_Get_By_User_Public = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!).Id
	const userNotes = await GetNotesByUserId(userId)
	if (!userNotes) {
		res.status(204).send('Nie posiadasz żadnych notatek')
		return
	}

	const userNotesPublic = userNotes.filter(function (Note) {
		return Note.IsPublic == true
	})

	if (userNotesPublic && userNotesPublic.length > 0) res.status(200).send(userNotesPublic)
	else res.status(204).send('Nie posiadasz żadnych publicznych notatek')
}

// Odczytanie notatek publicznych zalogowanego użytkownika
exports.Note_Get_By_Shared = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!).Id
	const userNotes = await GetSharedNotesByUserId(userId)
	if (!userNotes) {
		res.status(204).send('Nie posiadasz żadnych udostępnionych notatek!')
		return
	}

	if (userNotes.length > 0) res.status(200).send(userNotes)
	else res.status(204).send('Nie posiadasz żadnych udostępnionych notatek')
}

// Odczytanie notatek prywatnych zalogowanego użytkownika
exports.Note_Get_By_User_Private = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!).Id
	const userNotes = await GetNotesByUserId(userId)
	if (!userNotes) {
		res.status(204).send('Nie posiadasz żadnych notatek')
		return
	}

	const userNotesPrivate = userNotes.filter(function (Note) {
		return Note.IsPublic == false
	})

	if (userNotesPrivate && userNotesPrivate.length > 0) res.status(200).send(userNotesPrivate)
	else res.status(204).send('Nie posiadasz żadnych prywatnych notatek')
}

// Odczytanie notatki
exports.Note_Get = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const noteId = parseInt(req.params.id)
	const note = await GetNoteById(noteId)
	if (!note) res.status(404).send('Nie odnaleziono notatki z podanym ID.')
	else res.status(200).send(note)
}

// Utworzenie notatki
exports.Note_Post = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const title = req.body.title
	const content = req.body.content
	if (title == null && content == null) {
		res.status(400).send('Podano niewłaściwą notatke. Proszę uzupełnić tytuł i zawratość.')
		return
	}

	const userId = DownloadPaylod(req.headers.authorization?.split(' ')[1]!).Id

	const note = new Note(title, content, userId)

	const isPublic = req.body.isPublic
	if (isPublic) {
		if (isPublic.toLower().trim() == 'true' || isPublic.trim() == '1') note.IsPublic = true
		else note.IsPublic = false
	}

	const sharedUserIdsFromQuery: string = req.body.sharedUserIds
	if (sharedUserIdsFromQuery) {
		const userIdsTable = sharedUserIdsFromQuery.replace(';', ',').replace(':', ',').replace('.', ',').split(',')
		const sharedUserIds: number[] = []
		const users = await GetUsers()

		for (const userId of userIdsTable) {
			const user = users.findIndex(x => x.Id == +userId)
			if (user != null && user > 0) sharedUserIds.push(+userId)
		}
		note.SharedUserIds = sharedUserIds
	}

	const sendingTags = req.body.tags?.split(',')
	if (sendingTags && sendingTags?.length > 0) {
		let noteTags: Tag[] = []
		for (const tagName of sendingTags) {
			const tag = await IsTagExist(tagName)
			if (tag) noteTags.push(tag)
		}
		note.Tags = noteTags
	}
	await database.saveNote(note)

	res.status(201).send({
		Message: 'Notatka została utworzona!',
		Note: note,
	})
}

// Modyfikacja notatki
exports.Note_Put = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const id = parseInt(req.params.id)
	const note = await GetNoteById(id)

	if (note == null) {
		res.status(404).send('Nie odnaleziono notatki z podanym ID.')
		return
	}

	if (req.body.title != null) {
		note.Title = req.body.title
	}

	if (req.body.content != null) note.Content = req.body.content

	if (req.body.isPublic != null) {
		const isPublic = req.body.isPublic
		if (isPublic) {
			if (isPublic.toLower().trim() == 'true' || isPublic.trim() == '1') note.IsPublic = true
			else note.IsPublic = false
		}
	}

	if (req.body.tagsNames != null) {
		const sendingTags = req.body.tags?.split(',')

		if (sendingTags?.length > 0) {
			let noteTags: Tag[] = []
			for (const tagName of sendingTags) {
				const tag = await IsTagExist(tagName.toUpperCase)
				if (tag) noteTags.push(tag)
			}
			note.Tags = noteTags
		}
	}

	const sharedUserIdsFromQuery: string = req.body.sharedUserIds
	if (sharedUserIdsFromQuery) {
		const userIdsTable = sharedUserIdsFromQuery.replace(';', ',').replace(':', ',').replace('.', ',').split(',')
		const sharedUserIds: number[] = []
		const users = await database.downloadUsers()

		for (const userId of userIdsTable) {
			const user = users.findIndex(x => x.Id == +userId)
			if (user != null && user > 0) sharedUserIds.push(+userId)
		}
		note.SharedUserIds = sharedUserIds
	}

	await database.saveNote(note)
	res.status(200).send({
		Message: 'Zmodyfikowano notatkę!',
		Note: note,
	})
}

// Usunięcie notatki
exports.Note_Delete = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const noteId = parseInt(req.params.id)
	const note = await GetNoteById(noteId)
	if (!note) {
		res.status(404).send('Nie odnaleziono notatki z podanym ID.')
		return
	}
	const notes = await GetNotes()
	const index = notes?.findIndex(x => x.Id == note?.Id)
	await database.deleteNote(notes[index])
	res.status(200).send('Notatka została usunięta.')
}

//#region Admin
// Odczytanie listy wszystkich notatek
exports.Note_Get_All = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const admin = DownloadPaylod(req.headers.authorization?.split(' ')[1]!)
	if (admin?.IsAdmin == false) {
		res.status(401).send('Nie masz wystarczających uprawnień!')
		return
	}

	const notes = await GetNotes()
	const result = notes.reduce(function (r, a) {
		r[a.OwnerId] = r[a.OwnerId] || []
		r[a.OwnerId].push(a)
		return r
	}, Object.create(null))
	if (notes.length > 0) res.status(200).send(result)
	else res.status(204).send('Nie ma żadnych notatek.')
}

// Odczytanie listy notatek podanego użytkownika
exports.Note_Get_By_User_ID = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const admin = DownloadPaylod(req.headers.authorization?.split(' ')[1]!)
	if (admin?.IsAdmin == false) {
		res.status(401).send('Nie masz wystarczających uprawnień!')
	}

	const userId = parseInt(req.params.id)
	const userNotes = await GetNotesByUserId(userId)
	if (!userNotes) res.status(404).send('Nie odnalzeiono podanego użytkownika.')
	else if (userNotes.length == 0) res.status(204).send('Podany użytkownik nie posiada notatke.')
	else res.status(200).send(userNotes)
}
