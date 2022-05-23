import express from 'express'
import { Request, Response } from 'express'
import mongoose from 'mongoose';

const app = express()

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
	const schema = (new mongoose.Schema(
		{
			Name: {
				type: String,
				required: true,
				minlength: 3,
			},
			Surname: {
				type: String,
				required: true,
				minlength: 3,
			},
			Position: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Position',
				required: true,
			},
		},
		{ timestamps: true }
	))
	const model = mongoose.model('model', schema)
	 
	const test = new model(
	{
		Name: 'Imie',
		Surname: 'Nazwisko'

	})
	console.log('Model: ' + test)
})

app.listen(3000)
