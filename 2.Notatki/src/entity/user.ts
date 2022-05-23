import { CheckDatabaseLocation } from '../interfaces/database'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { blob } from 'stream/consumers'

export class User {
	constructor(
		public login: string,
		public password: string,
		public readonly Id: number = Date.now(),
		public readonly createDate = new Date().toISOString(),
		public IsAdmin = false,
		public name?: string,
		public surname?: string,
		public dateOfBirth?: Date
	) {
		// CheckDatabaseLocation()
		// 	.downloadUsers()
		// 	.then(usersData => {
		// 		if (usersData.findIndex(x => x.login.toLowerCase() == login.toLowerCase()) >= 0)
		// 			throw new Error('Użytkownik z podanym loginem już istnieje!')
		// 	})
		login = login.toLowerCase()
	}
}

export async function GetUserById(userId: number) {
	if (!userId || userId == 0) return null
	const users = await CheckDatabaseLocation().downloadUsers()
	const user = users?.find(x => x.Id == userId)
	if (!user) return null
	return user
}

export async function GetUsers() {
	return await CheckDatabaseLocation().downloadUsers()
}

export const UserModel = mongoose.model(
	'User',
	new mongoose.Schema(
		{
			_id: {
				type: Number,
			},
			Login: {
				type: String,
				required: true,
				lowercase: true,
			},
			Password: {
				type: String,
				required: true,
			},
			Name: {
				type: String,
			},
			Surname: {
				type: String,
			},
			DateOfBirth: {
				type: Date,
			},
			CreateDate: {
				type: Date,
				default: () => Date.now(),
			},
			IsAdmin: {
				type: Boolean,
				default: false,
			},
		},
		{
			_id: false,
		}
	)
)
