import mongoose, { ObjectId } from 'mongoose'

interface IProductNeed {
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

export async function GetProductNeedsWithPage(page: number) {
	if (page == 1) {
		return await ProductNeedModel.find().limit(5)
	} else {
		return await ProductNeedModel.find()
			.skip(page * 5 - 5)
			.limit(5)
	}
}

export async function GetProductNeedById(Id: ObjectId) {
	return await ProductNeedModel.findById(Id)
}
