import { sign, verify } from 'jsonwebtoken'
import { Request } from 'express'
import { User } from '../entity/user'
import { secret } from '../../config.json'
import { CheckDatabaseLocation } from '../interfaces/database'
import { json } from 'stream/consumers'
interface JwtPayload {
	user: User
}
type TokenPayload = {
	UserId: number
	Login: string
	IsAdmin: boolean
}

export function GenerateToken(user: User) {
	const payload = user
	return sign({ user }, secret, { expiresIn: '24h' })
}

export async function CheckToken(req: Request) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) return false

	try {
		const payload = verify(token, secret) as User
		await CheckDatabaseLocation()
			.downloadUsers()
			.then(usersData => {
				const index = usersData?.findIndex(x => x?.Id == payload.Id)
				const user = usersData[index]

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
	const user = payload.user as User
	return user
}
