import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetOrders, GetOrderById, OrderModel } from '../entities/Order'
import { ObjectId } from 'mongoose'

exports.Order_Get_All = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kelner, Kucharz, Kasjer, Księgowy, Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	// TODO Sortowanie

	const orders = await GetOrders()

	if (!orders) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(orders)
	}
}

exports.Order_Post = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kasjer, Księgowy, Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	// TODO Tworzenie i obliczanie kwoty

	const name = req.body.Name
	try {
		const order = new OrderModel({
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
			error: error.message,
		})
	}
}

exports.Order_Get = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kelner, Kucharz, Kasjer, Księgowy, Szef, Zastępca szefa'])
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
	const order = await GetOrderById(id)

	if (!order) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(order)
	}
}

exports.Order_Put = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kasjer, Księgowy, Szef, Zastępca szefa'])
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
	const order = await GetOrderById(id)

	if (!order) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await OrderModel.updateOne(
				{ _id: id },
				{
					$set: {
						Employee: req.body.Employee,
						Meal: req.body.Meal,
						OrderState: req.body.OrderState,
						Table: req.body.Table,
						Name: req.body.Name,
					},
				}
			)
			order!.Employee = req.body.Employee
			order!.Meal = req.body.Meal
			order!.OrderState = req.body.OrderState
			order!.Table = req.body.Table
			order!.Price = req.body.Price
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				order: order,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.Order_Delete = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kasjer, Księgowy, Szef, Zastępca szefa'])
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
	const order = await GetOrderById(id)

	if (!order) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await OrderModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
