import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import {
	GetReservations,
	GetReservationById,
	ReservationModel,
	GetReservationForNow,
	GetReservationForTomarrow,
	GetReservationForToday,
	GetReservationForDate,
	GetReservationForFullDate,
	GetByConfirm,
} from '../entities/Reservation'
import { ObjectId } from 'mongoose'

exports.Reservation_Get_All = async function (req: Request, res: Response) {
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

	let reservations: any
	const date = req.query.date as string
	if (date) {
		switch (date.toLowerCase()) {
			case 'now':
				reservations = await GetReservationForNow()
				break
			case 'today':
				reservations = await GetReservationForToday()
				break
			case 'tomarrow':
				reservations = await GetReservationForTomarrow()
				break
			default:
				try {
					const validDate = new Date(date)
					if (validDate.getHours() == 0) {
						reservations = await GetReservationForFullDate(validDate)
					} else {
						reservations = await GetReservationForDate(validDate)
					}
				} catch (error: any) {
					res.status(400).send(error.message)
				}
				break
		}
	} else {
		reservations = await GetReservations()
	}
	const sortValue = (req.query.sort as string) ?? 'null'
	const sortBy = (req.query.sortby as string) ?? 'null'
	if (sortBy) {
		switch (sortValue.toLowerCase()) {
			default:
			case 'desc':
				switch (sortBy.toLowerCase()) {
					case 'clientname':
						reservations = reservations.sort((one: { ClientName: string }, two: { ClientName: string }) =>
							one.ClientName > two.ClientName ? -1 : 1
						)
						break
					case 'startdate':
					default:
						reservations = reservations.sort((one: { startDate: Date }, two: { startDate: Date }) =>
							one.startDate > two.startDate ? -1 : 1
						)
						break
				}
				break
			case 'asc':
				switch (sortBy.toLowerCase()) {
					case 'clientname':
						reservations = reservations.sort((one: { ClientName: string }, two: { ClientName: string }) =>
							one.ClientName < two.ClientName ? -1 : 1
						)
						break
					case 'startdate':
					default:
						reservations = reservations.sort((one: { StartDate: Date }, two: { StartDate: Date }) =>
							one.StartDate < two.StartDate ? -1 : 1
						)
						break
				}
				break
		}
	}

	if (!reservations) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(reservations)
	}
}

exports.Reservation_Get_All_Corfirmed = async function (req: Request, res: Response) {
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

	let reservations: any
	const confirm = req.query.confirm as string
	if (confirm) {
		switch (confirm.toLowerCase()) {
			case 'true':
				reservations = await GetByConfirm(true)
				break
			case 'false':
				reservations = await GetByConfirm(false)
				break
			default:
				const confirmed = await GetByConfirm(true)
				const notConfirmed = await GetByConfirm(false)
				reservations = { Confirmed: confirmed, NotConfirmed: notConfirmed }
				break
		}
	} else {
		const confirmed = await GetByConfirm(true)
		const notConfirmed = await GetByConfirm(false)
		reservations = { Confirmed: confirmed, NotConfirmed: notConfirmed }
	}

	if (!reservations) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(reservations)
	}
}

exports.Reservation_Post = async function (req: Request, res: Response) {
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

	try {
		const tableId = req.body.TableId
		const clientName = req.body.ClientName
		const clientEmail = req.body.ClientEmail
		const startDate = req.body.StartDate
		const endDate = req.body.EndDate

		const reservation = new ReservationModel({
			TableId: tableId,
			ClientName: clientName,
			ClientEmail: clientEmail,
			StartDate: startDate,
			EndDate: endDate,
			IsConfirmed: false,
		})
		await reservation.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Reservation: reservation,
		})
	} catch (error: any) {
		res.status(400).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.Reservation_Get = async function (req: Request, res: Response) {
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
	const reservation = await GetReservationById(id)

	if (!reservation) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(reservation)
	}
}

exports.Reservation_Put = async function (req: Request, res: Response) {
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
	const reservation = await GetReservationById(id)
	let isConfirmed = req.body.IsConfirmed
	if (!isConfirmed) isConfirmed = 'false'

	if (!reservation) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await ReservationModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
						TableId: req.body.TableId,
						ClientName: req.body.ClientName,
						ClientEmail: req.body.ClientEmail,
						StartDate: req.body.StartDate,
						EndDate: req.body.EndDate,
						IsConfirmed: isConfirmed,
					},
				}
			)
			reservation!.TableId = req.body.TableId
			reservation!.ClientName = req.body.ClientName
			reservation!.ClientEmail = req.body.ClientEmail
			reservation!.StartDate = req.body.StartDate
			reservation!.EndDate = req.body.EndDate
			reservation!.IsConfirmed = isConfirmed
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				Reservation: reservation,
			})
		} catch (error: any) {
			res.send(400).send(error.message)
		}
	}
}

exports.Reservation_Delete = async function (req: Request, res: Response) {
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
	const reservation = await GetReservationById(id)

	if (!reservation) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await ReservationModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
