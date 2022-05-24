import mongoose, { Mongoose, ObjectId } from 'mongoose'

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
				unique: true,
				required: true,
			},
			MealCategory: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'MealCategory',
				unique: true,
				required: true,
			},
		},
		{ timestamps: false }
	)
)

export async function GetMeals() {
	return await MealModel.find()
}

export async function GetMealById(Id: ObjectId) {
	return await MealModel.findById(Id)
}
