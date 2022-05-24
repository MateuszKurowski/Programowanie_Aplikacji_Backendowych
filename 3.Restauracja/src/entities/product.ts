import mongoose, { ObjectId } from 'mongoose'

export const ProductModel = mongoose.model(
	'Product',
	new mongoose.Schema(
		{
			Name: {
				type: String,
				required: true,
			},
			Price: {
				type: Number,
				required: true,
				min: 0.01,
			},
			Quantity: {
				type: Number,
				required: true,
				min: 0,
			},
			Unit: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Unit',
				required: true,
			},
		},
		{ timestamps: false }
	)
)

export async function GetProducts() {
	return await ProductModel.find()
}

export async function GetProductById(Id: ObjectId) {
	return await ProductModel.findById(Id)
}
