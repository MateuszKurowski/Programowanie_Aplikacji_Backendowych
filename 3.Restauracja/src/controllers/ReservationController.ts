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
	ValidateDate,
} from '../entities/Reservation'
import mongoose from 'mongoose'

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
			case 'tomorrow':
				reservations = await GetReservationForTomarrow()
				break
			default:
				try {
					const validDate = new Date(date)
					if (!validDate) {
						res.status(400).send('Podano nieprawidłową datę.')
					}
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
						reservations = reservations.sort((one: { ClientName: string }, two: { ClientName: string }) => {
							if (one.ClientName > two.ClientName) {
								return -1
							}
							if (one.ClientName < two.ClientName) {
								return 1
							}
							return 0
						})
					case 'startdate':
					default:
						reservations = reservations.sort((one: { StartDate: Date }, two: { StartDate: Date }) => {
							if (one.StartDate > two.StartDate) {
								return -1
							}
							if (one.StartDate < two.StartDate) {
								return 1
							}
							return 0
						})
				}
				break
			case 'asc':
				switch (sortBy.toLowerCase()) {
					case 'clientname':
						reservations = reservations.sort((one: { ClientName: string }, two: { ClientName: string }) => {
							if (one.ClientName > two.ClientName) {
								return 1
							}
							if (one.ClientName < two.ClientName) {
								return -1
							}
							return 0
						})
					case 'startdate':
					default:
						reservations = reservations.sort((one: { StartDate: Date }, two: { StartDate: Date }) => {
							if (one.StartDate > two.StartDate) {
								return 1
							}
							if (one.StartDate < two.StartDate) {
								return -1
							}
							return 0
						})
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
	const confirmed = req.query.confirmed as string
	if (confirmed) {
		switch (confirmed.toLowerCase()) {
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
		const isConfirmed = req.body.IsConfirmed ?? false
		try {
			ValidateDate(startDate, endDate)
		} catch (error) {
			res.status(400).send('Wprowadzono niepoprawną date rezerwacji.')
			return
		}

		const reservation = new ReservationModel({
			TableId: tableId,
			ClientName: clientName,
			ClientEmail: clientEmail,
			StartDate: startDate,
			EndDate: endDate,
			IsConfirmed: isConfirmed,
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

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
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

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const reservation = await GetReservationById(id)
	let isConfirmed = req.body.IsConfirmed
	if (!isConfirmed) isConfirmed = 'false'

	if (!reservation) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			try {
				ValidateDate(req.body.StartDate, req.body.EndDate)
			} catch (error) {
				res.status(400).send('Wprowadzono niepoprawną date rezerwacji.')
				return
			}

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

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
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
