import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetOrders, GetOrderById, OrderModel } from '../entities/Order'
import { ObjectId } from 'mongoose'
import { IEmployee } from '../entities/Employee'
import { ITable } from '../entities/Table'
import { IOrderState } from '../entities/OrderState'
import { MealModel } from '../entities/Meal'

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

	let orders: any
	const sort = (req.query.sort as string) ?? 'null'
	const sortBy = (req.query.sortby as string) ?? 'null'
	if (sort) {
		switch (sort.toLowerCase()) {
			default:
			case 'desc':
				switch (sortBy.toLowerCase()) {
					case 'employee':
						orders = (await GetOrders()).sort((one, two) => {
							if ((one.Employee as unknown as IEmployee).Surname > (two.Employee as unknown as IEmployee).Surname) {
								return -1
							}
							if ((one.Employee as unknown as IEmployee).Surname < (two.Employee as unknown as IEmployee).Surname) {
								return 1
							}
							return 0
						})
						break
					case 'table':
						orders = (await GetOrders()).sort((one, two) => {
							if ((one.Table as unknown as ITable).TableNumber > (two.Table as unknown as ITable).TableNumber) {
								return -1
							}
							if ((one.Table as unknown as ITable).TableNumber < (two.Table as unknown as ITable).TableNumber) {
								return 1
							}
							return 0
						})
						break
					case 'price':
						orders = (await GetOrders()).sort((one, two) => {
							if (one.Price > two.Price) {
								return -1
							}
							if (one.Price < two.Price) {
								return 1
							}
							return 0
						})
					case 'orderstate':
					default:
						orders = (await GetOrders()).sort((one, two) => {
							if ((one.OrderState as unknown as IOrderState).Name > (two.OrderState as unknown as IOrderState).Name) {
								return -1
							}
							if ((one.OrderState as unknown as IOrderState).Name < (two.OrderState as unknown as IOrderState).Name) {
								return 1
							}
							return 0
						})
						break
				}
				break
			case 'asc':
				switch (sortBy.toLowerCase()) {
					case 'employee':
						orders = (await GetOrders()).sort((one, two) => {
							if ((one.Employee as unknown as IEmployee).Surname > (two.Employee as unknown as IEmployee).Surname) {
								return 1
							}
							if ((one.Employee as unknown as IEmployee).Surname < (two.Employee as unknown as IEmployee).Surname) {
								return -1
							}
							return 0
						})
						break
					case 'table':
						orders = (await GetOrders()).sort((one, two) => {
							if ((one.Table as unknown as ITable).TableNumber > (two.Table as unknown as ITable).TableNumber) {
								return 1
							}
							if ((one.Table as unknown as ITable).TableNumber < (two.Table as unknown as ITable).TableNumber) {
								return -1
							}
							return 0
						})
						break
					case 'price':
						orders = (await GetOrders()).sort((one, two) => {
							if (one.Price > two.Price) {
								return 1
							}
							if (one.Price < two.Price) {
								return -1
							}
							return 0
						})
					case 'orderstate':
					default:
						orders = (await GetOrders()).sort((one, two) => {
							if ((one.OrderState as unknown as IOrderState).Name > (two.OrderState as unknown as IOrderState).Name) {
								return 1
							}
							if ((one.OrderState as unknown as IOrderState).Name < (two.OrderState as unknown as IOrderState).Name) {
								return -1
							}
							return 0
						})
				}
				break
		}
	} else {
		orders = await GetOrders()
	}

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

	const employee = req.body.Employee
	const mealString = req.body.Meal
	const orderState = req.body.OrderState
	const table = req.body.Table
	let price = req.body.Price
	let calculatedPrice: number = 0
	let mealArray = []
	if (mealString) {
		mealArray = mealString.replace(':', ',').replace(';', ',').replace('.', ',').split(',')
		for (const mealId of mealArray) {
			const meal = await MealModel.findById(mealId)
			if (meal) {
				const price = parseInt(meal.Price)
				if (price) calculatedPrice += price
			}
		}
	}
	if (!price) price = calculatedPrice

	try {
		const order = new OrderModel({
			Employee: employee,
			Meal: mealArray,
			OrderState: orderState,
			Table: table,
			Price: price,
		})
		await order.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Order: order,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error.message,
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
						Price: req.body.Price,
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
				Order: order,
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
