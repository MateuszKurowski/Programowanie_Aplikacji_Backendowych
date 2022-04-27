import express from 'express'
import mongoose from 'mongoose'
import { notesSchema } from './entity/note'

const tagRoute = require('./Handlers/TagHandler')
const noteRoute = require('./Handlers/NoteHandler')
const userRoute = require('./Handlers/UserHandler')

const app = express()
app.use(express.json())

app.get('/', async function (req, res) {
	const connString = require('../config.json').connectionString
	// 1. Przygotowanie komunikacji - połączenie z bazą danych
	console.log('Connecting to mongo')
	const db = await mongoose.connect(connString)
	console.log('Mongo Connected!')

	// 2. Przygotowanie komunikacji - tworzenie schema z modelu
	const noteModel = mongoose.model('notes', notesSchema)

	// 3. Akcje - dodawanie wpisu
	const newNote = new noteModel({
		title: 'New note',
		content: 'From mongoose',
        ownerId: 1234,
        tags: ['Friday', 'Yellow', 'Kebab'],
        access: 'Private',
        createDate: Date.now(),
	})

	// 4. AKCJE - zapis
	const saveRet = await newNote.save() // także .update(), .updateMany(), .validate()
	console.log('SAVE - new note id: ', newNote.id)

	res.send('Hello World')
})

// app.use('/note', noteRoute)
// app.use('/tag', tagRoute)
// app.use('/user', userRoute)

app.listen(3000)
