import mongoose, { mongo } from 'mongoose'

export const EmployeeModel = mongoose.model(
	'Employee',
	new mongoose.Schema(
		{
			Login: {
				type: String,
				required: true,
				minlength: 3,
			},
			Password: {
				type: String,
				required: true,
				minlength: 3,
			},
			Name: {
				type: String,
				required: true,
				minlength: 3,
			},
			Surname: {
				type: String,
				required: true,
				minlength: 3,
			},
			Position: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Position',
				required: true,
			},
		},
		{ timestamps: true }
	)
)
