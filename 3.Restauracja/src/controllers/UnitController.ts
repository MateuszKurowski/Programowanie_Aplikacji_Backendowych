import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetUnitById, GetUnits, UnitModel } from '../entities/Unit'
import { ObjectId } from 'mongoose'

exports.Unit_Get_All = async function (req: Request, res: Response) {
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

	const units = await GetUnits()

	if (!units) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(units)
	}
}

exports.Unit_Post = async function (req: Request, res: Response) {
	res.status(403).send('Dodawanie zostało wyłaczone przez admina.')
	return
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
		const unit = await new UnitModel({
			Name: name,
		})
		await unit.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Unit: unit,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.Unit_Get = async function (req: Request, res: Response) {
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
	const unit = await GetUnitById(id)

	if (!unit) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(unit)
	}
}

exports.Unit_Put = async function (req: Request, res: Response) {
	res.status(403).send('Dodawanie zostało wyłaczone przez admina.')
	return
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
	const unit = await GetUnitById(id)

	if (!unit) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await UnitModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: req.body.Name,
				},
			}
		)
		unit.Name = req.body.Name
		res.status(200).send({
			Message: 'Operacja powiodła się.',
			Unit: unit,
		})
	}
}

exports.Unit_Delete = async function (req: Request, res: Response) {
	res.status(403).send('Dodawanie zostało wyłaczone przez admina.')
	return
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
	const unit = await GetUnitById(id)

	if (!unit) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await UnitModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
