import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetReservations, GetReservationById, ReservationModel } from '../entities/Reservation'
import { ObjectId } from 'mongoose'

exports.Reservation_Get_All = async function (req: Request, res: Response) {
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

	const reservations = await GetReservations()

	if (!reservations) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(reservations)
	}
}

exports.Reservation_Post = async function (req: Request, res: Response) {
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
		const reservation = await new ReservationModel({
			Name: name,
		})
		await reservation.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Reservation: reservation,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.Reservation_Get = async function (req: Request, res: Response) {
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
	const reservation = await GetReservationById(id)

	if (!reservation) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(reservation)
	}
}

exports.Reservation_Put = async function (req: Request, res: Response) {
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
	const reservation = await GetReservationById(id)

	if (!reservation) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await ReservationModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: req.body.Name,
				},
			}
		)
		reservation.Name = req.body.Name
		res.status(200).send({
			Message: 'Operacja powiodła się.',
			Reservation: reservation,
		})
	}
}

exports.Reservation_Delete = async function (req: Request, res: Response) {
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
	const reservation = await GetReservationById(id)

	if (!reservation) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await ReservationModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
