import { MongoTopologyClosedError } from 'mongodb'
import mongoose from 'mongoose'
import { TableModel } from './table'

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
			Client: {
				type: String,
				required: true,
				validate(value: string) {
					if (value.split(' ').length < 1) throw new Error('Proszę podać imię i nazwisko by dokonać rezerwacji!')
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
		},
		{ timestamps: true }
	)
)
