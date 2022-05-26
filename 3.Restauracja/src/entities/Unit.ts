import mongoose, { ObjectId } from 'mongoose'
export interface IUnit {
	Name: string
}

const schema = new mongoose.Schema<IUnit>(
	{
		Name: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{ timestamps: false }
)

export const UnitModel = mongoose.model<IUnit>('Unit', schema)

export async function GetUnits() {
	return await UnitModel.find()
}

export async function GetUnitById(Id: ObjectId) {
	return await UnitModel.findById(Id)
}
