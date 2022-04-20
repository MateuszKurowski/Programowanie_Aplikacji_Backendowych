import { error } from 'console'
import { Response, Request } from 'express'
import { User } from '../entity/user'
import { CheckDatabaseLocation } from '../interfaces/database'
import { CheckToken, DownloadPaylod, GenerateToken } from '../utility/token'
const database = CheckDatabaseLocation()

// Logowanie użytkownika / generowanie tokenu
exports.User_Login = async function (req: Request, res: Response) {
	const login: string = req.body.login
	const password: string = req.body.password
	if (!login || !password) {
		res.status(400).send('Proszę podać dane do logowania.')
		return
	}

	const users = await database.downloadUsers()
	const index = users.findIndex(x => x.login == login && x.password == password)

	if (!index || index < 0) res.status(401).send('Nieprawidłowe dane logowania.')
	else {
		const token = GenerateToken(users[index])
		res.status(200).send(token)
	}
}

// Odczytanie użytkownika
exports.User_Get = async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}
	const userId = DownloadPaylod(token)
	await database.downloadUsers().then(usersData => {
		const user = usersData.find(x => x.id == userId)
		res.status(200).send(user)
	})
}

// Utworzenie użytkownika
exports.User_Post = async function (req: Request, res: Response) {
	const login: string = req.body.login
	const password: string = req.body.password
	if (!login || !password) {
		res.status(400).send('Proszę podać dane do logowania.')
		return
	}

	try {
		const user = new User(login, password)
		const name = req.body.name
		if (name) user.name = name
		const surname = req.body.surname
		if (surname) user.surname = surname
		const dateOfBirth = req.body.dateOfBirth
		if (dateOfBirth) user.dateOfBirth = dateOfBirth
		database.saveUser(user)
		res.status(201).send('Użytkownik  ' + user.login + ' został utworzony. ID: ' + user.id)
	} catch (error) {
		if (error == 'Użytkownik z podanym loginem już istnieje!') res.status(409).send(error)
		else res.status(500)
		return
	}
}

// Modyfikacja użytkownika
exports.User_Put = async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}
	const userId = DownloadPaylod(token)
	await database.downloadUsers().then(usersData => {
		const user = usersData.find(x => x.id == userId)

		if (user == null) res.status(404).send('Nie odnaleziono użytkownika z podanym ID.')
		else {
			const login = req.body.login
			if (login) user.login = login
			const password = req.body.password
			if (password) user.password = password
			const name = req.body.name
			if (name) user.name = name
			const surname = req.body.surname
			if (surname) user.surname = surname
			const dateOfBirth = req.body.dateOfBirth
			if (dateOfBirth) user.dateOfBirth = dateOfBirth
			database.saveUser(user)
			res.status(201).send(user)
		}
	})
}

// Usunięcie użytkownika
exports.User_Delete = async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}
	const userId = DownloadPaylod(token)
	await database.downloadUsers().then(usersData => {
		const index = usersData.findIndex(x => x.id == userId)
		usersData.splice(index, 1)
		database.saveUsers(usersData)
		res.status(200)
	})
}

//#region Admin
// Odczytanie listy użytkowników
exports.User_Get_All = async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const users = database.downloadUsers()
	res.status(200).send(users)
}

// Odczytanie użytkownika po ID
exports.User_Get_By_Id = async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const users = await database.downloadUsers()
	const user = users.find(x => x.id == id)
	if (user == null) res.status(404).send('Nie odnaleziono użytkownika z podanym ID.')
	else res.status(200).send(user)
}

// Edycja użytkownika po ID
exports.User_Put_By_Id = async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const users = await database.downloadUsers()
	const user = users.find(x => x.id == id)
	if (user == null) res.status(404).send('Nie odnaleziono użytkownika z podanym ID.')
	else {
		const login = req.body.login
		if (login) user.login = login
		const password = req.body.password
		if (password) user.password = password
		const name = req.body.name
		if (name) user.name = name
		const surname = req.body.surname
		if (surname) user.surname = surname
		const dateOfBirth = req.body.dateOfBirth
		if (dateOfBirth) user.dateOfBirth = dateOfBirth
		database.saveUser(user)
		res.status(201).send(user)
	}
}

// Usuwanie użytkownika po ID
exports.User_Delete_By_Id = async function (req: Request, res: Response) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token || !CheckToken(token)) {
		res.status(401).send('Podano błędny token!')
		return
	}

	const id = parseInt(req.params.id)
	const users = await database.downloadUsers()
	const index = users.findIndex(x => x.id == id)
	if (index == null || index < 0) res.status(404).send('Nie odnaleziono użytkownika z podanym ID.')
	else {
		users.splice(index, 1)
		database.saveUsers(users)
		res.status(200)
	}
}
//#endregion
