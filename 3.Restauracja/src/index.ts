import express from 'express'
import { Request, Response } from 'express'

const app = express()

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
	res.send('GET Hello World')
})

app.listen(3000)
