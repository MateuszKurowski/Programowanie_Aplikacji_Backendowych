import { sign, verify } from 'jsonwebtoken'
import { Request } from 'express'
import { User } from '../entity/user'
import { secret } from '../../config.json'
import { CheckDatabaseLocation } from '../interfaces/database'
type TokenPayload = {
	Login: string
	UserId: number
}

export function GenerateToken(user: User) {
	const payload = {
		Login: user.login,
		UserId: user.Id,
		IsAdmin: user.IsAdmin,
	}
	return sign(payload, secret, { expiresIn: '1h' })
}

export async function CheckToken(req: Request) {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) return false

	try {
		const payload = verify(token, secret) as TokenPayload
		await CheckDatabaseLocation()
			.downloadUsers()
			.then(usersData => {
				const index = usersData?.findIndex(x => x?.Id == payload.UserId)
				const user = usersData[index]

				if (user)
					if (user.login == payload.Login) return true
					else return false
			})
	} catch (error) {
		return false
	}
}

export function DownloadPaylod(token: string) {
	const payload = verify(token, secret) as TokenPayload
	return payload.UserId
}
