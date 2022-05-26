import { Response, Request } from 'express'
import { GetOrderByDate, GetOrderByEmployeeId, GetOrderByTableId } from '../entities/Order'
import { GetTableById, GetTableByNumber, ITable } from '../entities/Table'
import { CheckPermission } from '../utility/Token'
import { ObjectId } from 'mongoose'
import { GetEmployeeById } from '../entities/Employee'

exports.Raport_Get_Orders_Per_Table = async function (req: Request, res: Response) {
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

	const tableInput = req.query.number
	const tableNumber = parseInt(tableInput as string)
	let orders: any[]
	if (isNaN(tableNumber)) {
		const table = (await GetTableByNumber(tableNumber)) as unknown as ITable
		orders = await GetOrderByTableId(table._id)
	}
	{
		const table = await GetTableById(tableInput as unknown as ObjectId)
		if (!table) {
			res.status(500).send('Wystąpił nieoczekiwany błąd. Skontaktuj się z administratorem!')
			return
		}
		orders = await GetOrderByTableId(table._id)
	}
	if (orders && orders.length > 0) res.status(200).send(orders)
	else res.status(404).send('Zapytanie nie zwróciło żadnego wyniku.')
}

exports.Raport_Get_Orders_Per_Employee = async function (req: Request, res: Response) {
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

	const employeeInput = req.query.number

	const employee = await GetEmployeeById(employeeInput as unknown as ObjectId)
	if (!employee) {
		res.status(500).send('Wystąpił nieoczekiwany błąd. Skontaktuj się z administratorem!')
		return
	}
	const orders = await GetOrderByEmployeeId(employee._id)

	if (orders && orders.length > 0) res.status(200).send(orders)
	else res.status(404).send('Zapytanie nie zwróciło żadnego wyniku.')
}

exports.Raport_Get_Orders_In_Time = async function (req: Request, res: Response) {
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

	const startDateString = req.query.startdate as string
	const endDateString = req.query.enddate as string
	let startDate: Date
	let endDate: Date
	try {
		startDate = new Date(startDateString)
		endDate = new Date(endDateString)
	} catch (error: any) {
		res.status(400).send({
			Message: 'Podane daty są nieprawidłowe!',
			Error: error.message,
		})
		return
	}
	const orders = await GetOrderByDate(startDate, endDate)

	if (orders && orders.length > 0) res.status(200).send(orders)
	else res.status(404).send('Zapytanie nie zwróciło żadnego wyniku.')
}

exports.Raport_Get_Cash_In_Time = async function (req: Request, res: Response) {
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

	const startDateString = req.query.startdate as string
	const endDateString = req.query.enddate as string
	let startDate: Date
	let endDate: Date
	try {
		startDate = new Date(startDateString)
		endDate = new Date(endDateString)
	} catch (error: any) {
		res.status(400).send({
			Message: 'Podane daty są nieprawidłowe!',
			Error: error.message,
		})
		return
	}
	const orders = await GetOrderByDate(startDate, endDate)

	let calculatedPrice: number = 0
	for (const order of orders)
	{
		const price = order.Price
		if (price) calculatedPrice += price
	}

	if (orders && orders.length > 0) res.status(200).send(
		{
			Message: 'Okresowy przychód wyniósł: ' + calculatedPrice,
			Orders: orders
		}
	)
	else res.status(404).send('Zapytanie nie zwróciło żadnego wyniku.')
}
