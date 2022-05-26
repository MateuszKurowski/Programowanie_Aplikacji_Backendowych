import mongoose, { ObjectId } from 'mongoose'
import { TableModel } from './Table'

export interface IReservation {
	TableId: mongoose.Schema.Types.ObjectId
	ClientName: string
	ClientEmail: string
	StartDate: Date
	EndDate: Date
	IsConfirmed: boolean
}

const schema = new mongoose.Schema<IReservation>(
	{
		TableId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Table',
			required: true,
			validate: {
				validator: async function (value: mongoose.Schema.Types.ObjectId) {
					const table = await TableModel.find().where('_id').equals(value).exec()
					if (table.length == 0) throw new Error('Nie ma takiego stolika!')
				},
			},
		},
		ClientName: {
			type: String,
			required: true,
			validate(value: string) {
				if (value.split(' ').length < 1) throw new Error('Proszę podać imię i nazwisko by dokonać rezerwacji!')
			},
		},
		ClientEmail: {
			type: String,
			required: false,
			maxlength: 60,
			validate(value: string) {
				if (!validateEmail(value)) throw new Error('Podano nieprawidłowy email!')
			},
		},
		StartDate: {
			type: Date,
			required: true,
			validate(value: Date) {
				//if (value <= new Date()) throw new Error('Rezerwować można tylko przyszłe terminy!')
			},
		},
		EndDate: {
			type: Date,
			required: true,
			validate(value: Date) {
				if (value <= new Date()) throw new Error('Rezerwować można tylko przyszłe terminy!')
			},
		},
		IsConfirmed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

export const ReservationModel = mongoose.model<IReservation>('Reservation', schema)

function validateEmail(email: string) {
	if (!email) return false

	const emailRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

	return emailRegex.test(email)
}

export async function GetReservations() {
	return await ReservationModel.find().populate('TableId', 'TableNumber SeatsNumber')
}

export async function GetByConfirm(confirm: boolean) {
	if (confirm) {
		return await ReservationModel.find({ IsConfirmed: true }).populate('TableId', 'TableNumber SeatsNumber')
	} else {
		return await ReservationModel.find({ IsConfirmed: false }).populate('TableId', 'TableNumber SeatsNumber')
	}
}

export async function GetReservationById(Id: ObjectId) {
	return await ReservationModel.findById(Id)
}

export async function GetReservationForNow() {
	return await ReservationModel.find({
		StartDate: { $lte: new Date() },
		EndDate: { $gte: new Date() },
	})
		.populate('TableId', '_id TableNumber SeatsNumber', TableModel)
		.exec()
}

export async function GetReservationForToday() {
	return await ReservationModel.find({
		StartDate: { $lte: new Date().setHours(23, 59, 59), $gte: new Date().setHours(0, 0, 0) },
	})
		.populate('TableId', '_id TableNumber SeatsNumber', TableModel)
		.exec()
}

export async function GetReservationForTomarrow() {
	return await ReservationModel.find({
		StartDate: {
			$lte: new Date(new Date().getDate() + 1).setHours(23, 59, 59),
			$gte: new Date(new Date().getDate() + 1).setHours(0, 0, 0),
		},
	})
		.populate('TableId', '_id TableNumber SeatsNumber', TableModel)
		.exec()
}

export async function GetReservationForDate(date: Date) {
	return await ReservationModel.find({
		StartDate: { $lte: new Date(date).setHours(23, 59, 59), $gte: new Date(date).setHours(0, 0, 0) },
	})
		.populate('TableId', '_id TableNumber SeatsNumber', TableModel)
		.exec()
}

export async function GetReservationForFullDate(date: Date) {
	return await ReservationModel.find({
		StartDate: { $lte: new Date(date) },
		EndDate: { $gte: new Date(date) },
	})
		.populate('TableId', '_id TableNumber SeatsNumber', TableModel)
		.exec()
}
