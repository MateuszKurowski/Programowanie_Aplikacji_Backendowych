import mongoose, { ObjectId } from 'mongoose'

export interface IOrder {
	Employee: mongoose.Schema.Types.ObjectId
	Meal: [mongoose.Schema.Types.ObjectId]
	OrderState: mongoose.Schema.Types.ObjectId
	Table: mongoose.Schema.Types.ObjectId
	Price: number
}

export const OrderModel = mongoose.model<IOrder>(
	'Order',
	new mongoose.Schema<IOrder>(
		{
			Employee: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Employee',
				required: true,
			},
			Meal: {
				type: [mongoose.Schema.Types.ObjectId],
				ref: 'Meal',
				required: true,
			},
			OrderState: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'OrderState',
				required: true,
			},
			Table: {
				type: mongoose.Schema.Types.ObjectId,
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
