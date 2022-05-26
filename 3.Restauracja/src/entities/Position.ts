import mongoose, { ObjectId } from 'mongoose'
import { EmployeeModel } from './Employee'

export interface IPosition {
	Name: string
	AccessLevel: number
}

export const PositionModel = mongoose.model<IPosition>(
	'Position',
	new mongoose.Schema<IPosition>(
		{
			Name: {
				type: String,
				unique: true,
				required: true,
			},
			AccessLevel: {
				type: Number,
				required: true,
				default: 0,
			},
		},
		{ timestamps: false }
	)
)

export async function GetPositions() {
	return await PositionModel.find()
}

export async function GetPositionById(Id: ObjectId) {
	return await PositionModel.findById(Id)
}

export async function GetUsersByPosition(position: any) {
	return await EmployeeModel.find().populate('Position').where('Position').equals(position).exec()
}
