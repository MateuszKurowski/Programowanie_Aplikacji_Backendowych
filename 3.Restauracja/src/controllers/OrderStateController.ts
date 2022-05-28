import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetOrderStateById, GetOrderStates, OrderStateModel } from '../entities/OrderState'
import { ObjectId } from 'mongoose'

exports.OrderState_Get_All = async function (req: Request, res: Response) {
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

	let orderStates: any
	const sortValue = (req.query.sort as string) ?? 'null'
	if (sortValue) {
		switch (sortValue.toLowerCase()) {
			default:
			case 'desc':
				orderStates = (await GetOrderStates()).sort((one, two) => {
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
				orderStates = (await GetOrderStates()).sort((one, two) => {
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
		orderStates = await GetOrderStates()
	}

	if (!orderStates) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(orderStates)
	}
}

exports.OrderState_Post = async function (req: Request, res: Response) {
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
		const orderState = new OrderStateModel({
			Name: name,
		})
		await orderState.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			OrderState: orderState,
		})
	} catch (error: any) {
		res.status(400).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.OrderState_Get = async function (req: Request, res: Response) {
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
	const orderState = await GetOrderStateById(id)

	if (!orderState) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(orderState)
	}
}

exports.OrderState_Put = async function (req: Request, res: Response) {
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
	const orderState = await GetOrderStateById(id)

	if (!orderState) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await OrderStateModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
					},
				}
			)
			orderState!.Name = req.body.Name
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				orderState: orderState,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.OrderState_Delete = async function (req: Request, res: Response) {
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
	const orderState = await GetOrderStateById(id)

	if (!orderState) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await OrderStateModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
