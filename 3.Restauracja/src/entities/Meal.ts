import mongoose, { ObjectId } from 'mongoose'

interface IMeal {
	Name: string
	Price: string
	MealCategory: mongoose.Schema.Types.ObjectId
}

const schema = new mongoose.Schema<IMeal>(
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

export const MealModel = mongoose.model<IMeal>('Meal', schema)

export async function GetMeals() {
	return await MealModel.find()
}

export async function GetMealById(Id: ObjectId) {
	return await MealModel.findById(Id)
}

export async function GetMealByCategoryId(Id: any) {
	if (Id == 'null') {
		return await MealModel.find()
	} else {
		return await MealModel.find({ MealCategory: Id as ObjectId })
	}
}
