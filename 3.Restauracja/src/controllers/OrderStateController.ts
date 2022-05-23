import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetOrdersByState, GetOrderStateById, GetOrderStates, OrderStateModel } from '../entities/OrderState'
import { ObjectId } from 'mongoose'

exports.OrderState_Get_All = async function (req: Request, res: Response) {
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

	const orderStates = await GetOrderStates()

	if (!orderStates) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(orderStates)
	}
}

exports.OrderState_Post = async function (req: Request, res: Response) {
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
		const orderState = await new OrderStateModel({
			Name: name,
		})
		await orderState.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			OrderState: orderState,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.OrderState_Get = async function (req: Request, res: Response) {
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
	const orderState = await GetOrderStateById(id)

	if (!orderState) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(orderState)
	}
}

exports.OrderState_Get_Orders = async function (req: Request, res: Response) {
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
	const orderState = await GetOrderStateById(id)
	if (!orderState) {
		res.status(404).send('Wynik jest pusty.')
	}
	const orders = await GetOrdersByState(orderState)

	if (!orders) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(orders)
	}
}

exports.OrderState_Put = async function (req: Request, res: Response) {
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
	const orderState = await GetOrderStateById(id)

	if (!orderState) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await OrderStateModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: req.body.Name,
				},
			}
		)
		orderState.Name = req.body.Name
		res.status(200).send({
			Message: 'Operacja powiodła się.',
			OrderState: orderState,
		})
	}
}

exports.OrderState_Delete = async function (req: Request, res: Response) {
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
	const orderState = await GetOrderStateById(id)

	if (!orderState) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await OrderStateModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
