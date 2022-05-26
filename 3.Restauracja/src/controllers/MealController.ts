import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetMeals, GetMealById, MealModel, GetMealByCategoryId } from '../entities/Meal'
import { ObjectId } from 'mongoose'

exports.Meal_Get_All = async function (req: Request, res: Response) {
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

	let meals: any
	const sort = (req.query.sort as string) ?? 'null'
	const sortBy = (req.query.sortby as string) ?? 'null'
	const category = (req.query.category as string) ?? 'null'
	if (sort) {
		switch (sort.toLowerCase()) {
			default:
			case 'desc':
				switch (sortBy.toLowerCase()) {
					case 'price':
						meals = (await GetMealByCategoryId(category)).sort((one, two) => (one.Price > two.Price ? -1 : 1))
						break
					case 'mealcategory':
						meals = (await GetMealByCategoryId(category)).sort((one, two) =>
							one.MealCategory > two.MealCategory ? -1 : 1
						)
						break
					case 'name':
					default:
						meals = (await GetMealByCategoryId(category)).sort((one, two) => (one.Name > two.Name ? -1 : 1))
						break
				}
				break
			case 'asc':
				switch (sortBy.toLowerCase()) {
					case 'price':
						meals = (await GetMealByCategoryId(category)).sort((one, two) => (one.Price < two.Price ? -1 : 1))
						break
					case 'mealcategory':
						meals = (await GetMealByCategoryId(category)).sort((one, two) =>
							one.MealCategory < two.MealCategory ? -1 : 1
						)
						break
					case 'name':
					default:
						meals = (await GetMealByCategoryId(category)).sort((one, two) => (one.Name < two.Name ? -1 : 1))
						break
				}
				break
		}
	} else {
		meals = await GetMeals()
	}

	if (!meals) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(meals)
	}
}

exports.Meal_Post = async function (req: Request, res: Response) {
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

	const name = req.body.Name
	const price = req.body.Price
	const mealCategory = req.body.MealCategory
	try {
		const meal = new MealModel({
			Name: name,
			Price: price,
			MealCategory: mealCategory,
		})
		await meal.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Meal: meal,
		})
	} catch (error: any) {
		res.status(400).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.Meal_Get = async function (req: Request, res: Response) {
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

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const meal = await GetMealById(id)

	if (!meal) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await MealModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
						Price: req.body.Price,
						MealCategory: req.body.MealCategory,
					},
				}
			)
			meal.Name = req.body.Name
			meal.Price = req.body.Price
			meal.MealCategory = req.body.MealCategory
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				Meal: meal,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.Meal_Delete = async function (req: Request, res: Response) {
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

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
	const meal = await GetMealById(id)

	if (!meal) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await MealModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
