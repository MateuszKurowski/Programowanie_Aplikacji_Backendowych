import mongoose from 'mongoose'

export const OrderStateModel = mongoose.model(
	'OrderState',
	new mongoose.Schema(
		{
			Name: {
				type: String,
				unique: true,
				required: true,
			},
		},
		{ timestamps: false }
	)
)
