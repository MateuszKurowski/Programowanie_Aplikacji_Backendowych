import mongoose from 'mongoose'

export const MealCategoryModel = mongoose.model(
	'MealCategory',
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
