import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import {
	GetTables,
	GetTableById,
	TableModel,
	GetBusyTablesForNow,
	GetTablesNumbers,
	GetBusyTablesForDate,
	GetBusyTablesForFullDate,
} from '../entities/Table'
import { ObjectId } from 'mongoose'

exports.Table_Get_All = async function (req: Request, res: Response) {
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

	let tables: any
	const sort = (req.query.sort as string) ?? 'null'
	const sortBy = (req.query.sortby as string) ?? 'null'
	if (sort) {
		switch (sort.toLowerCase()) {
			default:
			case 'desc':
				switch (sortBy.toLowerCase()) {
					case 'seats':
						tables = (await GetTables()).sort((one, two) => (one.SeatsNumber > two.SeatsNumber ? -1 : 1))
						break
					case 'number':
					default:
						tables = (await GetTables()).sort((one, two) => (one.TableNumber > two.TableNumber ? -1 : 1))
						break
				}
				break
			case 'asc':
				switch (sortBy.toLowerCase()) {
					case 'seats':
						tables = (await GetTables()).sort((one, two) => (one.SeatsNumber < two.SeatsNumber ? -1 : 1))
						break
					case 'number':
					default:
						tables = (await GetTables()).sort((one, two) => (one.TableNumber < two.TableNumber ? -1 : 1))
						break
				}
				break
		}
	} else {
		tables = await GetTables()
	}

	if (!tables) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(tables)
	}
}

exports.Table_Get_All_With_Status = async function (req: Request, res: Response) {
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

	const busyTablesNumbers = await GetBusyTablesForNow()
	const tablesNumbers = await GetTablesNumbers()
	const availableTablesNumbers = tablesNumbers
		.filter(table => busyTablesNumbers.indexOf(table.TableNumber) < 0)
		.map(table => table.TableNumber)
	const busyTables = await TableModel.find({
		TableNumber: { $in: busyTablesNumbers },
	}).exec()
	const availableTables = await TableModel.find({
		TableNumber: { $in: availableTablesNumbers },
	}).exec()
	const result = { BusyTables: busyTables, AvailableTables: availableTables }

	if (!result) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(result)
	}
}

exports.Table_Get_All_Available = async function (req: Request, res: Response) {
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

	let busyTablesNumbers: any
	const date = req.query.date
	if (date) {
		try {
			const validDate = new Date(date as string)
			if (validDate.getHours() == 0) {
				busyTablesNumbers = await GetBusyTablesForDate(validDate)
			} else {
				busyTablesNumbers = await GetBusyTablesForFullDate(validDate)
			}
		} catch (error) {
			res.status(400).send('Podano nieprawidłowy format daty!')
		}
	} else {
		busyTablesNumbers = await GetBusyTablesForNow()
	}

	const tablesNumbers = await GetTablesNumbers()
	const availableTables = tablesNumbers
		.filter(table => busyTablesNumbers.indexOf(table.TableNumber) < 0)
		.map(table => table.TableNumber)

	const seats = req.query.seats
	let tables: any
	if (seats) {
		tables = await TableModel.find({
			TableNumber: { $in: availableTables },
			SeatsNumber: +seats,
		}).exec()
	} else {
		tables = await TableModel.find({
			TableNumber: { $in: availableTables },
		}).exec()
	}

	if (!tables) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(tables)
	}
}

exports.Table_Get_All_Busy = async function (req: Request, res: Response) {
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

	const busyTablesNumbers = await GetBusyTablesForNow()

	const seats = req.query.seats
	let tables: any
	if (seats) {
		tables = await TableModel.find({
			TableNumber: { $in: busyTablesNumbers },
			SeatsNumber: +seats,
		}).exec()
	} else {
		tables = await TableModel.find({
			TableNumber: { $in: busyTablesNumbers },
		}).exec()
	}

	if (!tables) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(tables)
	}
}

exports.Table_Post = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Księgowy, Szef, Zastępca szefa'])
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
	const seatsNumber = req.body.SeatsNumber
	try {
		const table = new TableModel({
			Name: name,
			SeatsNumber: seatsNumber,
		})
		await table.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Table: table,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.Table_Get = async function (req: Request, res: Response) {
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
		await CheckPermission(req, ['Księgowy, Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const table = await GetTableById(id)

	if (!table) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await TableModel.updateOne(
				{ _id: id },
				{
					$set: {
						TableNumber: req.body.TableNumber,
						SeatsNumber: req.body.SeatsNumber,
					},
				}
			)
			table!.TableNumber = req.body.TableNumber
			table!.SeatsNumber = req.body.SeatsNumber
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				Table: table,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.Table_Delete = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Księgowy, Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const table = await GetTableById(id)

	if (!table) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await TableModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
