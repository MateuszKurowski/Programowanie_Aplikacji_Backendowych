import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetOrders, GetOrderById, OrderModel } from '../entities/Order'
import { ObjectId } from 'mongoose'

exports.Order_Get_All = async function (req: Request, res: Response) {
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

	const orders = await GetOrders()

	if (!orders) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(orders)
	}
}

exports.Order_Post = async function (req: Request, res: Response) {
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
		const order = await new OrderModel({
			Name: name,
		})
		await order.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Order: order,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.Order_Get = async function (req: Request, res: Response) {
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
	const order = await GetOrderById(id)

	if (!order) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(order)
	}
}

exports.Order_Put = async function (req: Request, res: Response) {
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
	const order = await GetOrderById(id)

	if (!order) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await OrderModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: req.body.Name,
				},
			}
		)
		order.Name = req.body.Name
		res.status(200).send({
			Message: 'Operacja powiodła się.',
			order: order,
		})
	}
}

exports.Order_Delete = async function (req: Request, res: Response) {
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
	const order = await GetOrderById(id)

	if (!order) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await OrderModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
