import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetUnitById, GetUnits, UnitModel } from '../entities/Unit'
import { ObjectId } from 'mongoose'

exports.Unit_Get_All = async function (req: Request, res: Response) {
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

	let units: any
	const sortValue = (req.query.sort as string) ?? 'null'
	if (sortValue) {
		switch (sortValue.toLowerCase()) {
			default:
			case 'desc':
				units = (await GetUnits()).sort((one, two) => {
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
				units = (await GetUnits()).sort((one, two) => {
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
		units = await GetUnits()
	}

	if (!units) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(units)
	}
}

exports.Unit_Post = async function (req: Request, res: Response) {
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
		const unit = new UnitModel({
			Name: name,
		})
		await unit.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Unit: unit,
		})
	} catch (error: any) {
		res.status(400).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.Unit_Get = async function (req: Request, res: Response) {
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
	const unit = await GetUnitById(id)

	if (!unit) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(unit)
	}
}

exports.Unit_Put = async function (req: Request, res: Response) {
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

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const unit = await GetUnitById(id)

	if (!unit) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await UnitModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
					},
				}
			)
			unit!.Name = req.body.Name
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				Unit: unit,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.Unit_Delete = async function (req: Request, res: Response) {
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

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const unit = await GetUnitById(id)

	if (!unit) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await UnitModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
