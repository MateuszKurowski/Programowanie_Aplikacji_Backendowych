import mongoose, { ObjectId } from 'mongoose'
interface ITableState {
	Name: string
}

const schema = new mongoose.Schema(
	{
		Name: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{ timestamps: false }
)

export const TableStateModel = mongoose.model<ITableState>('TableState', schema)

export async function GetTableStates() {
	return await TableStateModel.find()
}

export async function GetTableStateById(Id: ObjectId) {
	return await TableStateModel.findById(Id)
}
