import mongoose, { ObjectId } from 'mongoose'

export const OrderModel = mongoose.model(
	'Order',
	new mongoose.Schema(
		{
			Employee: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Employee',
				required: true,
			},
			Meal: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Meal',
				required: true,
			},
			OrderState: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'OrderState',
				required: true,
			},
			Table: {
				type: [mongoose.Schema.Types.ObjectId],
				ref: 'Table',
				required: true,
			},
			Price: {
				type: Number,
				min: 0,
				default: 0,
			},
		},
		{ timestamps: true }
	)
)

export async function GetOrders() {
	return await OrderModel.find()
}

export async function GetOrderById(Id: ObjectId) {
	return await OrderModel.findById(Id)
}
