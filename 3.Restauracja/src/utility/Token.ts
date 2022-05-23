import { sign, verify } from 'jsonwebtoken'
import { Request } from 'express'
import { secret } from '../../config.json'
import { EmployeeModel } from '../entities/Employee'
import { ObjectId } from 'mongoose'
import { PostionModel } from '../entities/Position'

interface JwtPayload {
	Id: ObjectId
	login: string
	position: number
}

export function GenerateToken(employee: any) {
	return sign({ Id: employee._id, login: employee.login, position: employee.position }, secret, { expiresIn: '24h' })
}

export async function CheckToken(req: Request) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) return false

	try {
		const payload = verify(token, secret) as JwtPayload
		await EmployeeModel.find().then((employeeData: any[]) => {
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

export async function CheckPermission(req: Request, positions: string[] = []) {
	if ((await CheckToken(req)) == false) {
		throw new Error('Autoryzacja nie powiodła się!')
	}

	const token = req.headers.authorization?.split(' ')[1]
	const user = DownloadPaylod(token!)
	if (positions.length == 0) return user
	const avaiblePositions = await PostionModel.find()
	for (const positionName of positions) {
		const positionId = avaiblePositions.find(x => x.Name.toLowerCase().trim() == positionName.toLowerCase().trim())
		if (user.Id == positionId) {
			return user
		}
	}
	throw new Error('Brak uprawnień!')
}
