import mongoose, { mongo } from 'mongoose'
import { TableStateModel } from './TableState'

export const TableModel = mongoose.model(
	'Table',
	new mongoose.Schema(
		{
			TableNumber: {
				type: Number,
				required: true,
			},
			SeatsNumber: {
				type: Number,
				required: true,
				validate(value: number) {
					if (value < 1) throw new Error('Ilość miejsc przy stoliku nie może być mniejsza niż 1!')
				},
			},
			State: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'TableState',
				default: async function () {
					return await TableStateModel.findOne({ Name: 'Wolny' })
				},
			},
		},
		{ timestamps: true }
	)
)
