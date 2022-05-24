import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetTables, GetTableById, TableModel } from '../entities/Table'
import { ObjectId } from 'mongoose'

exports.Table_Get_All = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	const tables = await GetTables()

	if (!tables) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(tables)
	}
}

exports.Table_Post = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	const name = req.body.Name
	try {
		const table = await new TableModel({
			Name: name,
		})
		await table.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Table: table,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.Table_Get = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const table = await GetTableById(id)

	if (!table) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(table)
	}
}

exports.Table_Put = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const table = await GetTableById(id)

	if (!table) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await TableModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: req.body.Name,
				},
			}
		)
		table.Name = req.body.Name
		res.status(200).send({
			Message: 'Operacja powiodła się.',
			Table: table,
		})
	}
}

exports.Table_Delete = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const table = await GetTableById(id)

	if (!table) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await TableModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
