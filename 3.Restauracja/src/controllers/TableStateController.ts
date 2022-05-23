import { Response, Request } from 'express'
import { CheckPermission, CheckToken, DownloadPaylod, GenerateToken } from '../utility/Token'
import { GetTableStateById, GetTableStates, TableStateModel } from '../entities/TableState'
import { ObjectId } from 'mongoose'

exports.TableState_Get_All = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err.Message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err.Message)
			return
		}
		if (err.Message == 'Brak uprawnień!') {
			res.status(403).send(err.Message)
		}
	}

	const tableStates = await GetTableStates()

	if (!tableStates) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(tableStates)
	}
}

exports.TableState_Post = async function (req: Request, res: Response) {
	res.status(403).send('Dodawanie zostało wyłaczone przez admina.')
	return
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err.Message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err.Message)
			return
		}
		if (err.Message == 'Brak uprawnień!') {
			res.status(403).send(err.Message)
		}
	}

	const name = req.body.name
	try {
		const tableState = new TableStateModel({
			Name: name,
		})
		await tableState.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			User: tableState,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error.Message,
		})
	}
}

exports.TableState_Get = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err.Message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err.Message)
			return
		}
		if (err.Message == 'Brak uprawnień!') {
			res.status(403).send(err.Message)
		}
	}

	if (!req.body.Id) res.status(400).send('Nieprawidłowe Id.')
	const id = req.body.Id as ObjectId
	const tableState = await GetTableStateById(id)

	if (!tableState) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(tableState)
	}
}

exports.TableState_Put = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err.Message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err.Message)
			return
		}
		if (err.Message == 'Brak uprawnień!') {
			res.status(403).send(err.Message)
		}
	}

	if (!req.body.Id) res.status(400).send('Nieprawidłowe Id.')
	const id = req.body.Id as ObjectId
	const tableState = await GetTableStateById(id)

	if (!tableState) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		await TableStateModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: tableState.name,
				},
			}
		)
		res.status(200).send(tableState)
	}
}

exports.TableState_Delete = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err.Message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err.Message)
			return
		}
		if (err.Message == 'Brak uprawnień!') {
			res.status(403).send(err.Message)
		}
	}

	if (!req.body.Id) res.status(400).send('Nieprawidłowe Id.')
	const id = req.body.Id as ObjectId
	const tableState = await GetTableStateById(id)

	if (!tableState) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		TableStateModel.deleteOne({ _id: id })
		res.status(200).send(tableState)
	}
}
