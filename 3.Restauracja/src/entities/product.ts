import mongoose, { ObjectId } from 'mongoose'

export interface IProduct {
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

export async function GetProductsWithPageAndSort(pageNumber: number, sort: string, sortBy: string) {
	switch (sort.toLowerCase()) {
		default:
		case 'desc':
			switch (sortBy.toLowerCase()) {
				case 'quantity':
					return await ProductModel.find()
						.sort({ Quantity: 'desc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
				case 'price':
					return await ProductModel.find()
						.sort({ Price: 'desc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
				case 'name':
				default:
					return await ProductModel.find()
						.sort({ Name: 'desc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
			}
		case 'asc':
			switch (sortBy.toLowerCase()) {
				case 'quantity':
					return await ProductModel.find()
						.sort({ Quantity: 'asc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
				case 'price':
					return await ProductModel.find()
						.sort({ Price: 'asc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
				case 'name':
				default:
					return await ProductModel.find()
						.sort({ Name: 'asc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
			}
	}
}

export async function GetProductsWithPage(pageNumber: number) {
	return await ProductModel.find()
		.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
		.limit(5)
}

export async function GetProductById(Id: ObjectId) {
	return await ProductModel.findById(Id)
}
