import mongoose, { ObjectId } from 'mongoose'

interface IProduct {
	Name: string
	Price: number
	Quantity: number
	Unit: mongoose.Schema.Types.ObjectId
}

const schema = new mongoose.Schema<IProduct>(
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

export const ProductModel = mongoose.model<IProduct>('Product', schema)

export async function GetProducts() {
	return await ProductModel.find()
}

export async function GetProductsWithPage(page: number) {
	if (page == 1) {
		return await ProductModel.find().limit(5)
	} else {
		return await ProductModel.find()
			.skip(page * 5 - 5)
			.limit(5)
	}
}

export async function GetProductById(Id: ObjectId) {
	return await ProductModel.findById(Id)
}
