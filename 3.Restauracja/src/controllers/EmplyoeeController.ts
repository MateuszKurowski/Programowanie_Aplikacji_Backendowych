import { Response, Request } from 'express'
import { CheckToken, DownloadPaylod, GenerateToken } from '../utility/Token'
import { EmployeeModel, GetEmplyoeeByCredits, GetEmployeeById, GetEmployees } from '../entities/Employee'

// Logowanie pracownika / generowanie tokenu
exports.Employee_Login = async function (req: Request, res: Response) {
	const login: string = req.body.Login
	const password: string = req.body.Password
	if (!login || !password) {
		res.status(400).send('Proszę podać dane do logowania.')
		return
	}

	const user = await GetEmplyoeeByCredits(login, password)

	if (!user) {
		res.status(401).send('Nieprawidłowe dane logowania.')
	} else {
		const token = GenerateToken(user)
		res.status(200).send(token)
	}
}

// Odczytanie pracownika
exports.Employee_Get = async function (req: Request, res: Response) {
	if ((await CheckToken(req)) == false) {
		res.status(401).send('Autoryzacja nie powiodła się!')
		return
	}

	const token = req.headers.authorization?.split(' ')[1]
	const userId = DownloadPaylod(token!).Id
	const user = await GetEmployeeById(userId)
	if (user) res.status(200).send(user)
}

// Utworzenie pracownika
exports.Employee_Post = async function (req: Request, res: Response) {
	const login: string = req.body.Login
	const password: string = req.body.Password
	if (!login || !password) {
		res.status(400).send('Proszę podać dane do logowania.')
		return
	}
	const name = req.body.Name
	const surname = req.body.Surname
	const position = req.body.Position
	try {
		const employee = new EmployeeModel({
			Login: login,
			Password: password,
			Name: name,
			Surname: surname,
			Position: position,
		})
		await employee.save()
		res.status(201).send({
			Message: 'Rejestracja powiodła sie!',
			User: employee,
		})
	} catch (error: any) {
		res.status(400).send({
			Message: 'Rejestracja nie powiodła sie!',
			Error: error._message,
		})
	}
}
