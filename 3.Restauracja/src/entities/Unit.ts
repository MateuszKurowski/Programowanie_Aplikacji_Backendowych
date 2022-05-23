import mongoose from 'mongoose'

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
