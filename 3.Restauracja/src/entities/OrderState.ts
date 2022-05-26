import mongoose, { ObjectId } from 'mongoose'
import { OrderModel } from './Order'

export interface IOrderState {
	Name: string
}

export const OrderStateModel = mongoose.model<IOrderState>(
	'OrderState',
	new mongoose.Schema<IOrderState>(
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

export async function GetOrderStates() {
	return await OrderStateModel.find()
}

export async function GetOrderStateById(Id: ObjectId) {
	return await OrderStateModel.findById(Id)
}

export async function GetOrdersByState(orderState: any) {
	return await OrderModel.find().populate('OrderState').where('OrderState').equals(orderState).exec()
}
