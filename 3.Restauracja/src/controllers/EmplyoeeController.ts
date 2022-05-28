import { Response, Request } from 'express'
import { CheckPermission, CheckToken, DownloadPaylod, GenerateToken } from '../utility/Token'
import { EmployeeModel, GetEmplyoeeByCredits, GetEmployeeById, GetEmployees, IEmployee } from '../entities/Employee'
import { ObjectId } from 'mongoose'

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

// Rejestracja nowego pracownika
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
			error: error.message,
		})
	}
}
// --------------------------------------- //

exports.Employee_Get = async function (req: Request, res: Response) {
	let user: any
	try {
		user = await CheckToken(req)
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}
	if (user != false && (user as IEmployee)) res.status(200).send(user)
	else res.status(500).send('Nie posiadasz konta pracownika.')
}

exports.Employee_Put = async function (req: Request, res: Response) {
	let user: any
	try {
		user = await CheckToken(req)
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!user) {
		res.status(500).send('Wystąpił nieoczekiwany błąd. Skontaktuj się z administratorem.')
	} else {
		try {
			await EmployeeModel.updateOne(
				{ _id: user._id },
				{
					$set: {
						Login: req.body.Login,
						Password: req.body.Password,
						Name: req.body.Name,
						Surname: req.body.Surname,
					},
				}
			)
			user!.Login = req.body.Login
			user!.Password = req.body.Password
			user!.Name = req.body.Name
			user!.Surname = req.body.Surname
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				Employee: user,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.Employee_Delete = async function (req: Request, res: Response) {
	let user: any
	try {
		user = await CheckToken(req)
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!user) {
		res.status(500).send('Wystąpił nieoczekiwany błąd. Skontaktuj się z administratorem.')
	} else {
		try {
			await EmployeeModel.deleteOne({ _id: user._id })
			res.status(200).send('Żegnam.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}

// ADMIN ---------------------------- //
exports.Employee_Get_List = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	const employees = await GetEmployees()
	if (employees && employees.length > 0) res.status(200).send(employees)
	else res.status(404).send('Zapytanie nie zwróciło żadnego wyniku')
}

exports.Employee_Get_By_Id = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	let id: ObjectId
	try {
		id = req.params.id as unknown as ObjectId
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const employee = await GetEmployeeById(id)

	if (employee) res.status(200).send(employee)
	else res.status(404).send('Zapytanie nie zwróciło żadnego wyniku')
}

exports.Employee_Put_By_Id = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	let id: ObjectId
	try {
		id = req.params.id as unknown as ObjectId
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const employee = await GetEmployeeById(id)

	if (!employee) {
		res.status(404).send('Zapytanie nie zwróciło żadnego wyniku')
	} else {
		try {
			await EmployeeModel.updateOne(
				{ _id: employee._id },
				{
					$set: {
						Login: req.body.Login,
						Password: req.body.Password,
						Name: req.body.Name,
						Surname: req.body.Surname,
						Position: req.body.Position,
					},
				}
			)
			employee!.Login = req.body.Login
			employee!.Password = req.body.Password
			employee!.Name = req.body.Name
			employee!.Surname = req.body.Surname
			employee!.Position = req.body.Position
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				Employee: employee,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.Employee_Delete_By_Id = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	let id: ObjectId
	try {
		id = req.params.id as unknown as ObjectId
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const employee = await GetEmployeeById(id)

	if (!employee) {
		res.status(404).send('Zapytanie nie zwróciło żadnego wyniku')
	} else {
		try {
			await EmployeeModel.deleteOne({ _id: employee._id })
			res.status(200).send('Pracownik został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
