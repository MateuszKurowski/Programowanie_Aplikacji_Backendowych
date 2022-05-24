import mongoose, { ObjectId } from 'mongoose'

export const MealModel = mongoose.model(
	'Meal',
	new mongoose.Schema(
		{
			Name: {
				type: String,
				unique: true,
				required: true,
			},
			Price: {
				type: String,
				required: true,
			},
			MealCategory: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'MealCategory',
				required: true,
			},
		},
		{ timestamps: true }
	)
)

export async function GetMeals() {
	return await MealModel.find()
}

export async function GetMealById(Id: ObjectId) {
	return await MealModel.findById(Id)
}
