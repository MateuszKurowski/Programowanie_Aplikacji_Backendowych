import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetMeals, GetMealById, MealModel } from '../entities/Meal'
import { ObjectId } from 'mongoose'

exports.Meal_Get_All = async function (req: Request, res: Response) {
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

	const meals = await GetMeals()

	if (!meals) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(meals)
	}
}

exports.Meal_Post = async function (req: Request, res: Response) {
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
	try {
		const meal = await new MealModel({
			Name: name,
		})
		await meal.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Meal: meal,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.Meal_Get = async function (req: Request, res: Response) {
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
	const meal = await GetMealById(id)

	if (!meal) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(meal)
	}
}

exports.Meal_Put = async function (req: Request, res: Response) {
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
	const meal = await GetMealById(id)

	if (!meal) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await MealModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: req.body.Name,
				},
			}
		)
		meal.Name = req.body.Name
		res.status(200).send({
			Message: 'Operacja powiodła się.',
			Meal: meal,
		})
	}
}

exports.Meal_Delete = async function (req: Request, res: Response) {
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
	const meal = await GetMealById(id)

	if (!meal) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await MealModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
