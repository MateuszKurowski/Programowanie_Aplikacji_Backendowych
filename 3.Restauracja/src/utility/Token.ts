import { sign, verify } from 'jsonwebtoken'
import { Request } from 'express'
import { secret } from '../../config.json'
import { EmployeeModel, IEmployee } from '../entities/Employee'
import { ObjectId } from 'mongoose'
import { PositionModel } from '../entities/Position'

interface JwtPayload {
	Id: ObjectId
}

export function GenerateToken(employee: any) {
	console.log(employee._id)
	return sign({ Id: employee._id }, secret)
}

export async function CheckToken(req: Request): Promise<IEmployee> {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) throw new Error('')

	let user: any
	let payload: any
	try {
		payload = verify(token, secret) as JwtPayload
		await EmployeeModel.find().then((employeeData: IEmployee[]) => {
			const index = employeeData?.findIndex(x => x?._id == payload.Id)
			user = employeeData[index]
		})
	} catch (error: any) {
		throw new Error(error.message)
	}
	if (!user) throw new Error('')
	return user
}

export function DownloadPaylod(token: string) {
	const payload = verify(token, secret) as JwtPayload
	return payload
}

export async function CheckPermission(req: Request, positions: string[] = []) {
	let user: any
	try {
		user = await CheckToken(req)
	} catch (error: any) {
		throw new Error(error.message)
	}

	if (user.Login.toLowerCase() == 'admin') return user
	if (positions.length == 0) return user
	const avaiblePositions = await PositionModel.find()
	for (const positionName of positions) {
		const positionId = avaiblePositions.find(x => x.Name.toLowerCase().trim() == positionName.toLowerCase().trim())
		if (user!.Id != (positionId!._id as unknown as ObjectId)) {
			return user
		}
	}
	throw new Error('Brak uprawnień!')
}
