import mongoose, { ObjectId } from 'mongoose'
import { ReservationModel } from './Reservation'

export interface ITable {
	_id: ObjectId
	TableNumber: number
	SeatsNumber: number
}

const schema = new mongoose.Schema<ITable>(
	{
		TableNumber: {
			type: Number,
			required: true,
			unique: true,
		},
		SeatsNumber: {
			type: Number,
			required: true,
			validate(value: number) {
				if (value < 1) throw new Error('Ilość miejsc przy stoliku nie może być mniejsza niż 1!')
			},
		},
	},
	{ timestamps: true }
)

export const TableModel = mongoose.model<ITable>('Table', schema)

export async function GetTables() {
	return await TableModel.find({}, '_id TableNumber SeatsNumber')
}

export async function GetTablesNumbers() {
	return await TableModel.find({}, 'TableNumber').exec()
}

export async function GetTableByNumber(tableNumber: number) {
	return await TableModel.find({ TableNumber: tableNumber })
}

export async function GetTableById(Id: ObjectId) {
	return await TableModel.findById(Id)
}

export async function GetBusyTablesForNow() {
	const reservations = await ReservationModel.find({
		StartDate: { $lte: new Date() },
		EndDate: { $gte: new Date() },
	})
		.select('TableId')
		.populate('TableId', 'TableNumber')
		.exec()
	let tableNumbers: number[] = []
	for (const reservation of reservations) {
		const table = reservation.TableId as unknown as ITable
		const tableNumber = table.TableNumber
		tableNumbers.push(tableNumber)
	}
	return tableNumbers
}

export async function GetBusyTablesForDate(date: Date) {
	const reservations = await ReservationModel.find({
		StartDate: { $lte: new Date(date).setHours(23, 59, 59), $gte: new Date(date).setHours(0, 0, 0) },
	})
		.select('TableId')
		.populate('TableId', 'TableNumber')
		.exec()
	let tableNumbers: number[] = []
	for (const reservation of reservations) {
		const table = reservation.TableId as unknown as ITable
		const tableNumber = table.TableNumber
		tableNumbers.push(tableNumber)
	}
	return tableNumbers
}

export async function GetBusyTablesForFullDate(date: Date) {
	const reservations = await ReservationModel.find({
		StartDate: { $lte: new Date(date) },
		EndDate: { $gte: new Date(date) },
	})
		.select('TableId')
		.populate('TableId', 'TableNumber')
		.exec()
	let tableNumbers: number[] = []
	for (const reservation of reservations) {
		const table = reservation.TableId as unknown as ITable
		const tableNumber = table.TableNumber
		tableNumbers.push(tableNumber)
	}
	return tableNumbers
}
