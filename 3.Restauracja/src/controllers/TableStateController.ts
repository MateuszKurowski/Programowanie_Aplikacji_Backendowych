import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetTableStateById, GetTableStates, TableStateModel } from '../entities/TableState'
import mongoose, { ObjectId } from 'mongoose'

exports.TableState_Get_All = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, [''])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	let tableStates: any
	const sortValue = (req.query.sort as string) ?? 'null'
	if (sortValue) {
		switch (sortValue.toLowerCase()) {
			default:
			case 'desc':
				tableStates = (await GetTableStates()).sort((one, two) => {
					if (one.Name > two.Name) {
						return -1
					}
					if (one.Name < two.Name) {
						return 1
					}
					return 0
				})
				break
			case 'asc':
				tableStates = (await GetTableStates()).sort((one, two) => {
					if (one.Name > two.Name) {
						return 1
					}
					if (one.Name < two.Name) {
						return -1
					}
					return 0
				})
				break
		}
	} else {
		tableStates = await GetTableStates()
	}

	if (!tableStates) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(tableStates)
	}
}

exports.TableState_Post = async function (req: Request, res: Response) {
	// res.status(403).send('Dodawanie zostało wyłaczone przez admina.')
	// return
	try {
		await CheckPermission(req, ['Szef'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	const name = req.body.Name
	try {
		const tableState = new TableStateModel({
			Name: name,
		})
		await tableState.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			TableState: tableState,
		})
	} catch (error: any) {
		res.status(400).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.TableState_Get = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, [''])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id  = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const tableState = await GetTableStateById(id)

	if (!tableState) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(tableState)
	}
}

exports.TableState_Put = async function (req: Request, res: Response) {
	// res.status(403).send('Modyfikowanie zostało wyłaczone przez admina.')
	// return
	try {
		await CheckPermission(req, ['Szef'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id  = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const tableState = await GetTableStateById(id)

	if (!tableState || !tableState!.Name) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await TableStateModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
					},
				}
			)
			tableState!.Name = req.body.Name
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				TableState: tableState,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.TableState_Delete = async function (req: Request, res: Response) {
	// res.status(403).send('Usuwanie zostało wyłaczone przez admina.')
	// return
	try {
		await CheckPermission(req, ['Szef'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id  = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const tableState = await GetTableStateById(id)

	if (!tableState) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await TableStateModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
