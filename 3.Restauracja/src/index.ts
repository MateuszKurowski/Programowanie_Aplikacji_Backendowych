import express from 'express'
import { Request, Response } from 'express'

const app = express()

app.use(express.json())

const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
console.log(regex.test('132456789'))

app.get('/', function (req: Request, res: Response) {
	res.send('GET Hello World')
})

app.listen(3000)
