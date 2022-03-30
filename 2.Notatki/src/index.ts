import express from 'express'
import { Request, Response } from 'express'
import { Note } from './note'
import { Tag } from './tags'
import fs from 'fs'
import { isJsxOpeningElement } from 'typescript'
import { UserModel } from './user'
import jwt from 'jsonwebtoken'

const app = express()

//const notes: Note[] = []
//const tagsList: Tag[] = []

async function readStorage(filePath: string) {
	try {
		const data = await fs.promises.readFile(filePath, 'utf-8')
		return JSON.parse(data)
	} catch (err) {
		console.log(err)
	}
}

async function updateStorage(dataToSave: string, filePath: string): Promise<void> {
	try {
		await fs.promises.writeFile(filePath, dataToSave)
	} catch (err) {
		console.log(err)
	}
}

app.use(express.json())

//#region API Notatki
// Dodanie notatki
app.post('/note', async function (req: Request, res: Response) {
	console.log('Tworzenie notatki..')
	console.log(req.headers.authorization)
	console.log(req.body)
	await readStorage('data/notes.json').then(async notesData => {
		await readStorage('data/tags.json').then(async tagsData => {
			const notes: Note[] = notesData
			const tags: Tag[] = tagsData
			const title = req.body.title
			const content = req.body.content
			const tagsNames = req.body.tags?.split(',')

			if (title == null && content == null) {
				res.status(400).send('Podano niewłaściwą notatke. Proszę uzupełnić tytuł i zawratość.')
				return
			}

			const note = new Note(title, content)
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
			await updateStorage(JSON.stringify(notes, null, 2), 'data/notes.json')
			await updateStorage(JSON.stringify(tags, null, 2), 'data/tags.json')

			const index = notes.findIndex(x => x.id == note.id)
			res.status(201).send('Utworzono nową notatkę o ID: ' + note.id + ' (' + index + ')')
		})
	})
})

// Odczytanie notatki
app.get('/note/:id', async function (req: Request, res: Response) {
	console.log('Pobranie notatki..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const id = parseInt(req.params.id)
	await readStorage('data/notes.json').then(async notesData => {
		const notes: Note[] = notesData
		const note = notes.find(x => x.id == id)
		if (note == null) res.status(404).send('Nie odnaleziono notatki z podanym ID.')
		else res.status(200).send(note)
	})
})

// Edycja notatki
app.put('/note/:id', async function (req: Request, res: Response) {
	console.log('Edycja notatki..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const id = parseInt(req.params.id)
	await readStorage('data/notes.json').then(async notesData => {
		await readStorage('data/tags.json').then(async tagsData => {
			const notes: Note[] = notesData
			const tags: Tag[] = tagsData
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
			await updateStorage(JSON.stringify(notes, null, 2), 'data/notes.json')
			await updateStorage(JSON.stringify(tags, null, 2), 'data/tags.json')

			notes[index] = note
			res.status(204).send()
		})
	})
})

// Usunięnice notatki
app.delete('/note/:id', async function (req: Request, res: Response) {
	console.log('Usuwanie notatki..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const id = parseInt(req.params.id)
	await readStorage('data/notes.json').then(async notesData => {
		const notes: Note[] = notesData
		const index = notes.findIndex(x => x.id == id)
		if (notes[index] != null) {
			notes.splice(index, 1)
			await updateStorage(JSON.stringify(notes, null, 2), 'data/notes.json')
			res.status(204).send('Notatka została usunięta.')
		} else res.status(400).send('Nie odnaleziono notatki z podanym ID.')
	})
})

// Pobranie wszystkich notatek
app.get('/notes', async function (req: Request, res: Response) {
	console.log('Pobieram liste notatek..')
	console.log(req.headers.authorization)
	console.log(req.body)
	await readStorage('data/notes.json').then(async notesData => {
		const notes: Note[] = notesData
		if (notes.length > 0) res.status(200).send(notes)
		else res.status(404).send('Nie ma żadnych notatek.')
	})
})
//#endregion

//#region API TagÓW
// Dodanie nowego tagu
app.post('/tag', async function (req: Request, res: Response) {
	console.log('Tworzenie tagu..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const name: string = req.body.name

	if (name == null) {
		res.status(400).send('Podano niewłaściwy tag. Proszę uzupełnić nazwę.')
		return
	}

	await readStorage('data/tags.json').then(async tagsData => {
		const tags: Tag[] = tagsData
		const sameTag = tags.find(x => x.name?.toLocaleLowerCase() == name.toLocaleLowerCase().trim())
		if (sameTag != null) {
			res.status(400).send('Podany tag już istnieje.')
			return
		}

		const tag = new Tag(name.trim())
		tags.push(tag)
		await updateStorage(JSON.stringify(tags, null, 2), 'data/tags.json')

		const index = tags.findIndex(x => x.id == tag.id)
		res.status(201).send('Utworzono nowy tag o ID: ' + tag.id + ' (' + index + ')')
	})
})

// Odczytanie tagu
app.get('/tag/:id', async function (req: Request, res: Response) {
	console.log('Pobranie tagu..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const id = parseInt(req.params.id)
	await readStorage('data/tags.json').then(async tagsData => {
		const tags: Tag[] = tagsData
		const tag = tags.find(x => x.id == id)
		if (tag == null) res.status(404).send('Nie odnaleziono tagu z podanym ID.')
		else res.status(200).send(tag)
	})
})

// Edycja tagu
app.put('/tag/:id', async function (req: Request, res: Response) {
	console.log('Edycja tagu..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const id = parseInt(req.params.id)
	await readStorage('data/tags.json').then(async tagsData => {
		const tags: Tag[] = tagsData
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
		await updateStorage(JSON.stringify(tags, null, 2), 'data/tags.json')

		res.status(204).send(tag)
	})
})

// Usunięnice tagu
app.delete('/tag/:id', async function (req: Request, res: Response) {
	console.log('Usuwanie tagu..')
	console.log(req.headers.authorization)
	console.log(req.body)
	const id = parseInt(req.params.id)
	await readStorage('data/tags.json').then(async tagsData => {
		const tags: Tag[] = tagsData
		const index = tags.findIndex(x => x.id == id)
		if (tags[index] != null) {
			tags.splice(index, 1)
			await updateStorage(JSON.stringify(tags, null, 2), 'data/tags.json')
			res.status(204).send('Tag został usunięty.')
		} else res.status(400).send('Nie odnaleziono tagu z podanym ID.')
	})
})

// Pobranie wszystkich tagów
app.get('/tags', async function (req: Request, res: Response) {
	console.log('Pobieram liste tagów..')
	console.log(req.headers.authorization)
	console.log(req.body)
	await readStorage('data/tags.json').then(async tagsData => {
		const tags: Tag[] = tagsData
		if (tags.length > 0) {
			console.log(req.body)
			res.status(200).send(tags)
		} else res.status(404).send('Nie ma żadnych tagów.')
	})
})
//#endregion

//#region login
app.post('/login', async function (req: Request, res: Response) {
	console.log('Tworzenie nowego użytnika..')
	console.log(req.headers.authorization)
	console.log(req.body)

	const login: string = req.body.login
	const password: string = req.body.password
	if (!(login && password)) {
		res.status(401).send('Proszę podać token.')
		return
	}

	await readStorage('data/logins.json').then(async loginData => {
		const users: UserModel[] = loginData
		const userInBase = users.find(x => x.userLogin.toLowerCase() == login.toLowerCase().trim())
		if (userInBase == null) {
			res.status(400).send('Podany użytkownik już istnieje.')
			return
		}

		const user: UserModel = new UserModel(login, password)
		const token = jwt.sign({ login }, process.env.TOKEN_KEY, {
			expiresIn: '2h',
		})
		user.userToken = token

		users.push(user)
		await updateStorage(JSON.stringify(users, null, 2), 'data/logins.json')

		res.status(201).send('Twój token to: ' + token)
	})
})

app.get('/login/:login', async function (req: Request, res: Response) {
	console.log('Pobranie użytkownika..')
	console.log(req.body)
	const login : string = req.params.login
	await readStorage('data/logins.json').then(async loginData => {
		const users: UserModel[] = loginData
		const user = users.find(x => x.userLogin == login)
		if (user) res.status(404).send('Podano błędny login.')
		else res.status(200).send(user)
	})
})

app.put('/login/:login', async function (req: Request, res : Response)
{
	console.log('Zmiana użytkownika')
	console.log(req.headers.authorization)
	console.log(req.body)
	await readStorage('data/logins.json').then(async loginData => 
	{
		const users: UserModel[] = loginData
		const user = user.find
		})

}
//#endregion

app.listen(3000)
