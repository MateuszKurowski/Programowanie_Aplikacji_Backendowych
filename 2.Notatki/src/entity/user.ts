import { CheckDatabaseLocation } from '../interfaces/database'

export class User {
	public readonly createDate = new Date().toISOString()
	public readonly id = Date.now()

	constructor(
		public login: string,
		public password: string,
		public name?: string,
		public surname?: string,
		public dateOfBirth?: Date
	) {
		CheckDatabaseLocation()
			.downloadUsers()
			.then(usersData => {
				if (usersData.findIndex(x => x.login.toLowerCase() == login.toLowerCase()) >= 0)
					throw new Error('Użytkownik z podanym loginem już istnieje!')
			})
	}
}
