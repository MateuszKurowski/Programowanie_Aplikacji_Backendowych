import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetRestaurantById, GetRestaurants, RestaurantModel } from '../entities/Restaurant'
import { ObjectId } from 'mongoose'

exports.Restaurant_Get_All = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	const restaurants = await GetRestaurants()

	if (!restaurants) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(restaurants)
	}
}

exports.Restaurant_Post = async function (req: Request, res: Response) {
	res.status(403).send('Dodawanie zostało wyłaczone przez admina.')
	return
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	const name = req.body.Name
	const address = req.body.Address
	const telNumber = req.body.TelNumber
	const nip = req.body.NIP
	const email = req.body.Email
	const wwww = req.body.WWW
	try {
		const restaurant = await new RestaurantModel({
			Name: name,
			Address: address,
			TelNumber: telNumber,
			NIP: nip,
			Email: email,
			WWW: wwww,
		})
		await restaurant.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Restaurant: restaurant,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.Restaurant_Get = async function (req: Request, res: Response) {
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const restaurant = await GetRestaurantById(id)

	if (!restaurant) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(restaurant)
	}
}

exports.Restaurant_Put = async function (req: Request, res: Response) {
	res.status(403).send('Dodawanie zostało wyłaczone przez admina.')
	return
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const restaurant = await GetRestaurantById(id)

	if (!restaurant) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await RestaurantModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: req.body.name,
				},
			}
		)
		restaurant.Name = req.body.name
		res.status(200).send({
			Message: 'Operacja powiodła się.',
			Restaurant: restaurant,
		})
	}
}

exports.Restaurant_Delete = async function (req: Request, res: Response) {
	res.status(403).send('Dodawanie zostało wyłaczone przez admina.')
	return
	try {
		CheckPermission(req, [''])
	} catch (err: any) {
		if (err._message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(err._message)
			return
		}
		if (err._message == 'Brak uprawnień!') {
			res.status(403).send(err._message)
		}
	}

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const restaurant = await GetRestaurantById(id)

	if (!restaurant) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await RestaurantModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
