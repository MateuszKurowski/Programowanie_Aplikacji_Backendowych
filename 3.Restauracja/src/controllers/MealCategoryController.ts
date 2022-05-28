import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetMealCategories, GetMealCategoryById, MealCategoryModel } from '../entities/MealCategory'
import mongoose, { ObjectId } from 'mongoose'

exports.MealCategory_Get_All = async function (req: Request, res: Response) {
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

	let mealCategories: any
	const sortValue = (req.query.sort as string) ?? 'null'
	if (sortValue) {
		switch (sortValue.toLowerCase()) {
			default:
			case 'desc':
				mealCategories = (await GetMealCategories()).sort((one, two) => {
					if (one.Name > two.Name) {
						return -1
					}
					if (one.Name < two.Name) {
						return 1
					}
					return 0
				})
				break
			case 'asc':
				mealCategories = (await GetMealCategories()).sort((one, two) => {
					if (one.Name > two.Name) {
						return 1
					}
					if (one.Name < two.Name) {
						return -1
					}
					return 0
				})
				break
		}
	} else {
		mealCategories = await GetMealCategories()
	}

	if (!mealCategories) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(mealCategories)
	}
}

exports.MealCategory_Post = async function (req: Request, res: Response) {
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
	try {
		const mealCategory = new MealCategoryModel({
			Name: name,
		})
		await mealCategory.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			MealCategory: mealCategory,
		})
	} catch (error: any) {
		res.status(400).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.MealCategory_Get = async function (req: Request, res: Response) {
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

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id  = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const mealCategory = await GetMealCategoryById(id)

	if (!mealCategory) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(mealCategory)
	}
}

exports.MealCategory_Put = async function (req: Request, res: Response) {
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

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id  = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const mealCategory = await GetMealCategoryById(id)

	if (!mealCategory) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await MealCategoryModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
					},
				}
			)
			mealCategory.Name = req.body.Name
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				MealCategory: mealCategory,
			})
		} catch (error: any) {
			res.status(200).send(error.message)
		}
	}
}

exports.MealCategory_Delete = async function (req: Request, res: Response) {
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

	if (!req.params.id) res.status(400).send('Podano błędne ID.')
	let id: any
	try {
		id  = new mongoose.Types.ObjectId(req.params.id as string)
	} catch (error: any) {
		res.status(403).send({
			Message: 'Podano błędne ID.',
			Error: error.message,
		})
		return
	}
	const mealCategory = await GetMealCategoryById(id)

	if (!mealCategory) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await MealCategoryModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
