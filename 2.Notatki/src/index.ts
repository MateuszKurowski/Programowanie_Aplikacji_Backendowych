import express from 'express'
import { Request, Response } from 'express'
import { Note } from './entity/note'
import { Tag } from './entity/tag'
import { saveData } from '../config.json'
import { User } from './entity/user'
import { SQLDatabase } from './utility/SQLDatabase'
import { FilesDatabase } from './utility/FilesDatabase'
import { CheckDatabaseLocation, DatabaseOperation } from './interfaces/database'
import { CheckToken, DownloadPaylod, GenerateToken } from './utility/token'
import { basename } from 'path'
import { userInfo } from 'os'

const app = express()
app.use(express.json())
const database = CheckDatabaseLocation()

//#region Notes
// Pobranie wszystkich notatek
app.get('/note/list', async function (req: Request, res: Response) {
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
})

// Dodanie notatki
app.get('/note', async function (req: Request, res: Response) {
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
})

// Odczytanie notatki
app.get('/note/:id', async function (req: Request, res: Response) {
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
})

// Edycja notatki
app.put('/note/:id', async function (req: Request, res: Response) {
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
})

// Usunięnice notatki
app.delete('/note/:id', async function (req: Request, res: Response) {
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
})

//#endregion

//#region Tags
// Dodanie nowego tagu
app.post('/tag', async function (req: Request, res: Response) {
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
})

// Odczytanie tagu
app.get('/tag/:id', async function (req: Request, res: Response) {
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
})

// Edycja tagu
app.put('/tag/:id', async function (req: Request, res: Response) {
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
})

// Usunięnice tagu
app.delete('/tag/:id', async function (req: Request, res: Response) {
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
})

// Pobranie wszystkich tagów
app.get('/tags', async function (req: Request, res: Response) {
	console.log('Pobieram liste tagów..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const tags = await database.downloadTags()
	if (tags.length > 0) {
		console.log(req.body)
		res.status(200).send(tags)
	} else res.status(404).send('Nie ma żadnych tagów.')
})
//#endregion

//#region User / Authentication
// Rejestracja nowego użytkownika
app.post('/user/register', async function (req: Request, res: Response) {
	const login: string = req.body.login
	const password: string = req.body.password
	if (!login || !password) {
		res.status(400).send('Proszę podać dane do logowania.')
		return
	}

	try {
		const user = new User(login, password)
		const name = req.body.name
		if (name) user.name = name
		const surname = req.body.surname
		if (surname) user.surname = surname
		const dateOfBirth = req.body.dateOfBirth
		if (dateOfBirth) user.dateOfBirth = dateOfBirth
		database.saveUser(user)
		res.status(201).send('Użytkownik  ' + user.login + ' został utworzony. ID: ' + user.id)
	} catch (error) {
		if (error == 'Użytkownik z podanym loginem już istnieje!') res.status(409).send(error)
		else res.status(500)
		return
	}
})

app.post('/user/login', async function (req: Request, res: Response) {
	const login: string = req.body.login
	const password: string = req.body.password
	if (!login || !password) {
		res.status(400).send('Proszę podać dane do logowania.')
		return
	}

	const users = await database.downloadUsers()
	const index = users.findIndex(x => x.login == login && x.password == password)

	if (!index || index < 0) res.status(401).send('Nieprawidłowe dane logowania.')
	else {
		const token = GenerateToken(users[index])
		res.status(200).send(token)
	}
})

// Pobieranie wszystkich użytkowników
app.get('/user/list', async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const users = database.downloadUsers()
	res.status(200).send(users)
})

// Pobieranie użytkownika
app.get('/user/:id', async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const users = await database.downloadUsers()
	const user = users.find(x => x.id == id)
	if (user == null) res.status(404).send('Nie odnaleziono użytkownika z podanym ID.')
	else res.status(200).send(user)
})

// Pobieranie swojego użytkownika
app.get('/user', async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}
	const userId = DownloadPaylod(token)
	await database.downloadUsers().then(usersData => {
		const user = usersData.find(x => x.id == userId)
		res.status(200).send(user)
	})
})

//Edycja użytkownika
app.put('/user/:id', async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const users = await database.downloadUsers()
	const user = users.find(x => x.id == id)
	if (user == null) res.status(404).send('Nie odnaleziono użytkownika z podanym ID.')
	else {
		const login = req.body.login
		if (login) user.login = login
		const password = req.body.password
		if (password) user.password = password
		const name = req.body.name
		if (name) user.name = name
		const surname = req.body.surname
		if (surname) user.surname = surname
		const dateOfBirth = req.body.dateOfBirth
		if (dateOfBirth) user.dateOfBirth = dateOfBirth
		database.saveUser(user)
		res.status(201).send(user)
	}
})

//Edycja swojego użytkownika
app.put('/user', async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}
	const userId = DownloadPaylod(token)
	await database.downloadUsers().then(usersData => {
		const user = usersData.find(x => x.id == userId)

		if (user == null) res.status(404).send('Nie odnaleziono użytkownika z podanym ID.')
		else {
			const login = req.body.login
			if (login) user.login = login
			const password = req.body.password
			if (password) user.password = password
			const name = req.body.name
			if (name) user.name = name
			const surname = req.body.surname
			if (surname) user.surname = surname
			const dateOfBirth = req.body.dateOfBirth
			if (dateOfBirth) user.dateOfBirth = dateOfBirth
			database.saveUser(user)
			res.status(201).send(user)
		}
	})
})

// Usuwanie użytkownika
app.delete('/user/:id', async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const users = await database.downloadUsers()
	const index = users.findIndex(x => x.id == id)
	if (index == null || index < 0) res.status(404).send('Nie odnaleziono użytkownika z podanym ID.')
	else {
		users.splice(index, 1)
		database.saveUsers(users)
		res.status(200)
	}
})

// Usuwanie swojego użytkownika
app.delete('/user', async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}
	const userId = DownloadPaylod(token)
	await database.downloadUsers().then(usersData => {
		const index = usersData.findIndex(x => x.id == userId)
		usersData.splice(index, 1)
		database.saveUsers(usersData)
		res.status(200)
	})
})
//#endregion

app.listen(3000)
