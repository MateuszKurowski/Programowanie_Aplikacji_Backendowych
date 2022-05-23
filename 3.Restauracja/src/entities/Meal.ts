import mongoose, { Mongoose } from 'mongoose'

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

export class Meal {
	constructor(public Name: string, public Price: number, public Category: string) {}
}
