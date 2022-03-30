export class UserModel {
	userLogin: string
	userPassword: string
	userToken: string

	constructor(login: string, password: string) {
		this.userLogin = login
		this.userPassword = password
	}
}
