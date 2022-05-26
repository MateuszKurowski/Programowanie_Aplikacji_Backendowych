import mongoose, { ObjectId } from 'mongoose'

interface IMealCategory {
	Name: string
}

export const MealCategoryModel = mongoose.model<IMealCategory>(
	'MealCategory',
	new mongoose.Schema<IMealCategory>(
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
