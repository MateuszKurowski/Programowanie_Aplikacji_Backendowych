import express from 'express'
import { Request, Response } from 'express'
import { Note } from './note'

const app = express()

const notes: Note[] = []

app.use(express.json())

// Dodanie notatki
app.post('/note', function (req: Request, res: Response) {
	console.log('Tworzenie notatki..')
	console.log(req.body)
	const title = req.body.title
	const content = req.body.content
	if (title == null && content == null)
		res.status(400).send('Podano niewłaściwą notatke. Proszę uzupełnić tytuł i zawratość.')
	else {
		const note = new Note(title, content)
		if (req.body.tags != null) {
			const tagsArray = req.body.tags.split(',')
			for (let tag of tagsArray) {
				note.tags.push(tag)
			}
		}
		notes.push(note)
		const index = notes.findIndex(x => x.id == note.id)
		res.status(201).send('Utworzono nową notatkę o ID: ' + note.id + ' (' + index + ')')
	}
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
	const note = notes[id]
	if (note == null) {
		res.status(404).send('Nie odnaleziono notatki z podanym ID.')
	} else {
		if (req.body.title != null) {
			note.title = req.body.title
		}
		if (req.body.content != null) note.content = req.body.content
		//if (req.body.createDate != null) note.createDate = req.body.createDate
		//if (req.body.tags != null) note.tags = req.body.tags
		res.status(204).send(note)
	}
})

// Usunięnice notatki
app.delete('/note/:id', function (req: Request, res: Response) {
	console.log('Usuwanie notatki..')
	const id = parseInt(req.params.id)
	if (notes[id] != null) {
		notes.splice(id, 1)
		res.status(204).send('Notatka usunięta.')
	} else res.status(400).send('Nie odnaleziono notatki z podanym ID.')
})

// Usunięnice notatki
app.get('/list', function (req: Request, res: Response) {
	console.log('Pobieram notatki..')
	console.log(req.body) // e.x. req.body.title
	res.status(200).send(notes)
})

app.listen(3000)
