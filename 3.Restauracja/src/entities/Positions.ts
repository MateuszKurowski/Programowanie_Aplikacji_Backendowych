import mongoose from 'mongoose'

export const PostionModel = mongoose.model(
	'Position',
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
