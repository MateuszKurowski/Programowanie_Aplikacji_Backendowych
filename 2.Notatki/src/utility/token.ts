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
		UserId: user.id,
	}
	return sign(payload, secret, { expiresIn: '1h' })
}

export function CheckToken(req: Request): boolean {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) return false

	const payload = verify(token, secret) as TokenPayload
	CheckDatabaseLocation()
		.downloadUsers()
		.then(usersData => {
			const index = usersData?.findIndex(x => x?.id == payload.UserId)
			const user = usersData[index]

			if (user) if (user.login == payload.Login) return true
			return false
		})
	return false
}

export function DownloadPaylod(token: string) {
	const payload = verify(token, secret) as TokenPayload
	return payload.UserId
}
