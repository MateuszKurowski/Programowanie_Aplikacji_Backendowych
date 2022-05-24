import mongoose, { ObjectId } from 'mongoose'
import { TableModel } from './Table'

export const ReservationModel = mongoose.model(
	'Reservation',
	new mongoose.Schema(
		{
			Table: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Table',
				required: true,
				validate: {
					validator: async function (value: number) {
						const table = await TableModel.find().where('TableNumber').equals(value).exec()
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
					if (value.getDate < Date.now) throw new Error('Rezerwować można tylko przyszłe terminy!')
				},
			},
			EndDate: {
				type: Date,
				required: true,
				validate(value: Date) {
					if (value.getDate < Date.now) throw new Error('Rezerwować można tylko przyszłe terminy!')
				},
			},
			IsConfirmed: {
				type: Boolean,
				default: false,
			},
		},
		{ timestamps: true }
	)
)

function validateEmail(email: string) {
	if (!email) return false

	const emailRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

	return emailRegex.test(email)
}

export async function GetReservations() {
	return await ReservationModel.find()
}

export async function GetReservationById(Id: ObjectId) {
	return await ReservationModel.findById(Id)
}
