import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetMealCategories, GetMealCategoryById, MealCategoryModel } from '../entities/MealCategory'
import { ObjectId } from 'mongoose'

exports.MealCategory_Get_All = async function (req: Request, res: Response) {
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

	const mealCategorys = await GetMealCategories()

	if (!mealCategorys) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(mealCategorys)
	}
}

exports.MealCategory_Post = async function (req: Request, res: Response) {
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
		const mealCategory = await new MealCategoryModel({
			Name: name,
		})
		await mealCategory.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			MealCategory: mealCategory,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.MealCategory_Get = async function (req: Request, res: Response) {
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
	const mealCategory = await GetMealCategoryById(id)

	if (!mealCategory) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(mealCategory)
	}
}

exports.MealCategory_Put = async function (req: Request, res: Response) {
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
	const mealCategory = await GetMealCategoryById(id)

	if (!mealCategory) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
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
	}
}

exports.MealCategory_Delete = async function (req: Request, res: Response) {
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
	const mealCategory = await GetMealCategoryById(id)

	if (!mealCategory) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await MealCategoryModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
