import express from 'express'
import mongoose from 'mongoose'

const tagRoute = require('./Handlers/TagHandler')
const noteRoute = require('./Handlers/NoteHandler')
const userRoute = require('./Handlers/UserHandler')

const app = express()
app.use(express.json())

app.use('/note', noteRoute)
app.use('/tag', tagRoute)
app.use('/user', userRoute)

app.listen(3000)