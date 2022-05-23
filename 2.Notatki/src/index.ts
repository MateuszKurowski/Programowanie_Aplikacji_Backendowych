import express from 'express'
import { Response, Request } from 'express'
import mongoose from 'mongoose'
import { UserModel } from './entity/user'
import { CheckDatabaseLocation, StartConnection } from './interfaces/database'
import { SQLDatabase } from './utility/SQLDatabase'

const tagRoute = require('./Handlers/TagHandler')
const noteRoute = require('./Handlers/NoteHandler')
const userRoute = require('./Handlers/UserHandler')

const app = express()
app.use(express.json())
StartConnection()
// app.get('/', async (req: Request, res: Response) => {
// 	// const testSchema = new mongoose.Schema(
// 	// 	{
// 	// 		title: String,
// 	// 		content: String,
// 	// 		private: Boolean,
// 	// 		tags: [String],
// 	// 	},
// 	// 	{
// 	// 		timestamps: true,
// 	// 	}
// 	// )
// 	// const testModel = mongoose.model('testSchema', testSchema)
// 	// const newNote = new testModel({
// 	// 	title: 'New note',
// 	// 	content: 'From mongoose',
// 	// 	private: true,
// 	// 	tags: ['Friday', 'Yellow', 'Kebab'],
// 	// })
// 	// const saveRet = await newNote.save()

// 	const user = new UserModel({
// 		_id: Date.now(),
// 		Login: 'Test',
// 		Pasword: 'Test',
// 		Name: 'Test',
// 		Surname: 'Test',
// 	})
// 	await user
// 		.Save()
// 		.then((result: any) => {
// 			res.status(200).send(result)
// 		})
// 		.catch((err: any) => {
// 			console.log(err)
// 		})

// 	res.status(200).send('')
// })

app.use('/note', noteRoute)
app.use('/tag', tagRoute)
app.use('/user', userRoute)

app.listen(3000)
