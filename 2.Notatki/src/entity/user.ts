import { CheckDatabaseLocation } from '../interfaces/database'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

export class User {
	public readonly createDate = new Date().toISOString()
	private _id = 0

	constructor(
		public login: string,
		public password: string,
		public name?: string,
		public surname?: string,
		public dateOfBirth?: Date,
		private _isAdmin = false
	) {
		CheckDatabaseLocation()
			.downloadUsers()
			.then(usersData => {
				if (usersData.findIndex(x => x.login.toLowerCase() == login.toLowerCase()) >= 0)
					throw new Error('Użytkownik z podanym loginem już istnieje!')
			})
	}

	public get Id() {
		return this._id
	}

	public SetId() {
		if (this._id == 0) this._id = Date.now()
	}

	public get IsAdmin() {
		return this._isAdmin
	}

	public SetAdminPermission() {
		if (this._isAdmin == false) this._isAdmin = true
	}

	public RemoveAdminPermission() {
		if (this._isAdmin == true) this._isAdmin = false
	}
}

export async function GetUserById(userId: number) {
	if (!userId || userId == 0) return null
	const users = await CheckDatabaseLocation().downloadUsers()
	const user = users?.find(x => x.Id == userId)
	if (!user) return null
	return user
}

export const UserModel = mongoose.model(
	'User',
	new mongoose.Schema(
		{
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
		},
		{
			timestamps: true,
		}
	)
)
