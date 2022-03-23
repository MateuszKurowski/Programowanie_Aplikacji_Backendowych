import express from 'express'
import { Request, Response } from 'express'
import { Note } from './note'
import { Tag } from './tags'
import fs from 'fs'

const app = express()

const notes: Note[] = []
const tagsList: Tag[] = []
const filePath = "data.json"

async function readStorage() {
	try {
		return await fs.promises.readFile(filePath, 'utf-8')
	} 
	catch (err) {
		console.log(err)
	}
  }

async function updateStorage(dataToSave : Note[]): Promise<void> {
	try {
		await fs.promises.writeFile(filePath, JSON.stringify(dataToSave))
	} catch (err) {
		console.log(err)
	}
  }

app.use(express.json())

//#region API Notatki
// Dodanie notatki
app.post('/note', function (req: Request, res: Response) {
	console.log('Tworzenie notatki..')
	console.log(req.body)
	const storage = readStorage()
	console.log(storage)
	const title = req.body.title
	const content = req.body.content
	const tagsNames = req.body.tags?.split(',')

	if (title == null && content == null) {
		res.status(400).send('Podano niewłaściwą notatke. Proszę uzupełnić tytuł i zawratość.')
		return
	}

	const note = new Note(title, content)
	let tags: Tag[] = []
	if (tagsNames?.length > 0) {
		tagsNames.forEach((tagName: string) => {
			let existingTag = tagsList.find(x => x.name.toLowerCase() == tagName.toLowerCase().trim())
			if (existingTag == null) {
				existingTag = new Tag(tagName.trim())
				tagsList.push(existingTag)
			}
			tags.push(existingTag)
		})
		note.tags = tags
	}
	notes.push(note)
	updateStorage(notes)

	const index = notes.findIndex(x => x.id == note.id)
	res.status(201).send('Utworzono nową notatkę o ID: ' + note.id + ' (' + index + ')')
})

// Odczytanie notatki
app.get('/note/:id', function (req: Request, res: Response) {
	console.log('Pobranie notatki..')
	const id = parseInt(req.params.id)
	const note = notes.find(x => x.id == id)
	if (note == null) res.status(404).send('Nie odnaleziono notatki z podanym ID.')
	else res.status(200).send(note)
})

// Edycja notatki
app.put('/note/:id', function (req: Request, res: Response) {
	console.log('Edycja notatki..')
	console.log(req.body)
	const id = parseInt(req.params.id)
	const index = notes.findIndex(x => x.id == id)
	const note = notes[index]

	if (note == null) {
		res.status(404).send('Nie odnaleziono notatki z podanym ID.')
		return
	}

	console.log(note.id)
	console.log(note.title)
	if (req.body.title != null) {
		console.log('1')
		note.title = req.body.title
	}

	if (req.body.content != null) note.content = req.body.content
	console.log('2')
	if (req.body.tagsNames != null) {
		console.log('3')
		const tagsNames = req.body.tagsNames.split(',')
		let tags: Tag[] = []
		tagsNames.forEach((tagName: string) => {
			let existingTag = tagsList.find(x => x.name.toLowerCase() == tagName.toLowerCase())
			if (existingTag == null) {
				existingTag = new Tag(tagName)
				tagsList.push(existingTag)
			}
			tags.push(existingTag)
		})
		note.tags = tags
	}

	console.log('4')
	console.log(index)
	console.log(note.title)
	notes[index] = note
	res.status(204).send()
})

// Usunięnice notatki
app.delete('/note/:id', function (req: Request, res: Response) {
	console.log('Usuwanie notatki..')
	const id = parseInt(req.params.id)
	const index = notes.findIndex(x => x.id == id)
	if (notes[index] != null) {
		notes.splice(index, 1)
		res.status(204).send('Notatka usunięta.')
	} else res.status(400).send('Nie odnaleziono notatki z podanym ID.')
})

// Pobranie wszystkich notatek
app.get('/notes', function (req: Request, res: Response) {
	console.log('Pobieram liste notatek..')
	console.log(req.body)
	if (notes.length > 0) res.status(200).send(notes)
	else res.status(400).send('Nie ma żadnych notatek.')
})
//#endregion

//#region API TagÓW
// Dodanie nowego tagu
app.post('/tag', function (req: Request, res: Response) {
	console.log('Tworzenie tagu..')
	console.log(req.body)
	const name: string = req.body.name

	if (name == null) {
		res.status(400).send('Podano niewłaściwy tag. Proszę uzupełnić nazwę.')
		return
	}
	const sameTag = tagsList.find(x => x.id == tag.id)
	if (sameTag?.name.toLocaleLowerCase() == name.toLocaleLowerCase().trim()) {
		res.status(400).send('Podany tag już istnieje.')
		return
	}

	const tag = new Tag(name.trim())
	tagsList.push(tag)

	const index = tagsList.findIndex(x => x.id == tag.id)
	res.status(201).send('Utworzono nowy tag o ID: ' + tag.id + ' (' + index + ')')
})

// Odczytanie tagu
app.get('/tag/:id', function (req: Request, res: Response) {
	console.log('Pobranie tagu..')
	const id = parseInt(req.params.id)
	const tag = tagsList.find(x => x.id == id)
	if (tag == null) res.status(404).send('Nie odnaleziono tagu z podanym ID.')
	else res.status(200).send(tag)
})

// Edycja tagu
app.put('/tag/:id', function (req: Request, res: Response) {
	console.log('Edycja tagu..')
	console.log(req.body)
	const id = parseInt(req.params.id)
	const tag = tagsList[id]

	if (tag == null) {
		res.status(404).send('Nie odnaleziono tagu z podanym ID.')
		return
	}

	if (req.body.name != null) {
		tag.name = req.body.name
	}

	tagsList[id] = tag
	res.status(204).send(tag)
})

// Usunięnice tagu
app.delete('/tag/:id', function (req: Request, res: Response) {
	console.log('Usuwanie tagu..')
	const id = parseInt(req.params.id)
	if (tagsList[id] != null) {
		tagsList.splice(id, 1)
		res.status(204).send('Tag usunięty.')
	} else res.status(400).send('Nie odnaleziono tagu z podanym ID.')
})

// Pobranie wszystkich tagów
app.get('/tags', function (req: Request, res: Response) {
	console.log('Pobieram liste tagów..')
	if (tagsList.length > 0) {
		console.log(req.body)
		res.status(200).send(tagsList)
	}
})
//#endregion

app.listen(3000)

