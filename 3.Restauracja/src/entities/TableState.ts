import mongoose, { ObjectId } from 'mongoose'

export const TableStateModel = mongoose.model(
	'TableState',
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

export async function GetTableStates() {
	return await TableStateModel.find()
}

export async function GetTableStateById(Id: ObjectId) {
	return await TableStateModel.findById(Id)
}
