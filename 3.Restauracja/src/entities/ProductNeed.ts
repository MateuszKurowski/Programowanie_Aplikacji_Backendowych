import mongoose, { ObjectId } from 'mongoose'

export interface IProductNeed {
	Name: string
	Quantity: number
	Unit: mongoose.Schema.Types.ObjectId
}

const schema = new mongoose.Schema<IProductNeed>(
	{
		Name: {
			type: String,
			required: true,
		},
		Quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		Unit: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Unit',
			required: true,
		},
	},
	{ timestamps: false }
)

export const ProductNeedModel = mongoose.model<IProductNeed>('ProductNeed', schema)

export async function GetProductNeeds() {
	return await ProductNeedModel.find()
}

export async function GetProductNeedsWithPageAndSort(pageNumber: number, sort: string, sortBy: string) {
	switch (sort.toLowerCase()) {
		default:
		case 'desc':
			switch (sortBy.toLowerCase()) {
				case 'quantity':
					return await ProductNeedModel.find()
						.sort({ Quantity: 'desc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
				case 'name':
				default:
					return await ProductNeedModel.find()
						.sort({ Name: 'desc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
			}
		case 'asc':
			switch (sortBy.toLowerCase()) {
				case 'quantity':
					return await ProductNeedModel.find()
						.sort({ Quantity: 'asc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
				case 'name':
				default:
					return await ProductNeedModel.find()
						.sort({ Name: 'asc' })
						.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
						.limit(5)
			}
	}
}

export async function GetProductNeedsWithPage(pageNumber: number) {
	return await ProductNeedModel.find()
		.skip(pageNumber == 1 ? 1 : pageNumber * 5 - 5)
		.limit(5)
}

export async function GetProductNeedById(Id: ObjectId) {
	return await ProductNeedModel.findById(Id)
}
