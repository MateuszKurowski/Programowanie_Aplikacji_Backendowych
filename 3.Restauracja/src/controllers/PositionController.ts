import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetPositionById, GetPositions, GetUsersByPosition, PositionModel } from '../entities/Position'
import { ObjectId } from 'mongoose'

exports.Position_Get_All = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	const positions = await GetPositions()

	if (!positions) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(positions)
	}
}

exports.Position_Post = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
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
	const accessLevel = req.body.AccessLevel
	try {
		const position = await new PositionModel({
			Name: name,
			AccessLevel: accessLevel,
		})
		await position.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Position: position,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.Position_Get = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
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
	const position = await GetPositionById(id)

	if (!position) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(position)
	}
}

exports.Position_Get_Employees = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
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
	const position = await GetPositionById(id)
	if (!position) {
		res.status(404).send('Wynik jest pusty.')
	}
	const employees = await GetUsersByPosition(position)

	if (!employees) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(employees)
	}
}

exports.Position_Put = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
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
	const position = await GetPositionById(id)

	if (!position) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await PositionModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.name,
						AccessLevel: req.body.AccessLevel,
					},
				}
			)
			position!.Name = req.body.name
			position!.AccessLevel = req.body.AccessLevel
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				Position: position,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.Position_Delete = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
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
	const position = await GetPositionById(id)

	if (!position) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await PositionModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
