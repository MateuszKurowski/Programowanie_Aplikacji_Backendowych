import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'

exports.Raport_Get_Orders_Per_Table = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, [''])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	// TODO
}

exports.Raport_Get_Orders_Per_Employee = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, [''])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	// TODO
}

exports.Raport_Get_Orders_In_Time = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, [''])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	// TODO
}

exports.Raport_Get_Cash_In_Time = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, [''])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	// TODO
}
