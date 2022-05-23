import { Jwt, sign, verify } from 'jsonwebtoken'
import { Request } from 'express'
import { EmployeeModel } from '../entities/Employee'
import { secret } from '../../config.json'
import { CheckDatabaseLocation } from '../interfaces/database'
import { json } from 'stream/consumers'
interface JwtPayload {
	Id: number
	login: string
	position: number
}

export function GenerateToken(employee: any) {
	const payload = employee
	return sign({ Id: employee._id, login: employee.login, position: employee.position }, secret, { expiresIn: '24h' })
}

export async function CheckToken(req: Request) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) return false

	try {
		const payload = verify(token, secret) as JwtPayload
		await CheckDatabaseLocation()
			.download('Emplyoee')
			.then((employeeData: any[]) => {
				const index = employeeData?.findIndex(x => x?.Id == payload.Id)
				const user = employeeData[index]

				if (user)
					if (user.login == payload.login) return true
					else return false
			})
	} catch (error) {
		return false
	}
}

export function DownloadPaylod(token: string) {
	const payload = verify(token, secret) as JwtPayload
	return payload
}
