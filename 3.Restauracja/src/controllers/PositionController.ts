import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetPositionById, GetPositions, GetUsersByPosition, PositionModel } from '../entities/Position'
import mongoose, { ObjectId } from 'mongoose'

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

	let positions: any
	const sortValue = (req.query.sort as string) ?? 'null'
	if (sortValue) {
		switch (sortValue.toLowerCase()) {
			default:
			case 'desc':
				positions = (await GetPositions()).sort((one, two) => {
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
				positions = (await GetPositions()).sort((one, two) => {
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
		positions = await GetPositions()
	}

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
		const position = new PositionModel({
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
	const position = await GetPositionById(id)

	if (!position) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await PositionModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
						AccessLevel: req.body.AccessLevel,
					},
				}
			)
			position!.Name = req.body.Name
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
