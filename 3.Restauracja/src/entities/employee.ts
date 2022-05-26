import mongoose, { ObjectId } from 'mongoose'

interface IEmployee {
	Login: string
	Password: string
	Name: string
	Surname: string
	Position: mongoose.Schema.Types.ObjectId
}

export const EmployeeModel = mongoose.model<IEmployee>(
	'Employee',
	new mongoose.Schema<IEmployee>(
		{
			Login: {
				type: String,
				required: true,
				minlength: 3,
				lowercase: true,
				unique: true,
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

export async function GetEmployees() {
	return await EmployeeModel.find().populate('Position')
}

export async function GetEmployeeById(Id: ObjectId) {
	return await EmployeeModel.findById(Id).populate('Position')
}

export async function GetEmplyoeeByCredits(login: string, password: string) {
	return await EmployeeModel.findOne({ Login: login, Password: password }).populate('Position')
}
