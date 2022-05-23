import mongoose, { ObjectId } from 'mongoose'

export const UnitModel = mongoose.model(
	'Unit',
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

export async function GetUnits() {
	return await UnitModel.find()
}

export async function GetUnitById(Id: ObjectId) {
	return await UnitModel.findById(Id)
}
