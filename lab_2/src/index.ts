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
		const index = notes.length + 1
		const note = new Note(title, content)
		note.id = index
		notes.push(note)
		res.status(201).send(note)
	}
})

// Odczytanie notatki
app.get('/note/:id', function (req: Request, res: Response) {
	console.log('Pobranie notatki..')
	console.log(req.body) // e.x. req.body.title
	const id = parseInt(req.params.id)
	const note = notes[id]
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
		if (req.body.createDate != null) note.createDate = req.body.createDate
		if (req.body.tags != null) note.tags = req.body.tags
		res.status(204).send(note)
	}
})

// Usunięnice notatki
app.delete('/note/:id', function (req: Request, res: Response) {
	console.log('Usuwanie notatki..')
	console.log(req.body) // e.x. req.body.title
	const id = parseInt(req.params.id)
	if (notes[id] != null) res.status(204).send('Notatka usunięta.')
	else res.status(400).send('Nie odnaleziono notatki z podanym ID.')
})

app.listen(3000)
