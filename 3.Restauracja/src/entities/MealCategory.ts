import mongoose, { ObjectId } from 'mongoose'

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

export async function GetMealCategories() {
	return await MealCategoryModel.find()
}

export async function GetMealCategoryById(Id: ObjectId) {
	return await MealCategoryModel.findById(Id)
}
