import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetProductNeedById, GetProductNeeds, GetProductNeedsWithPage, GetProductNeedsWithPageAndSort, ProductNeedModel } from '../entities/ProductNeed'
import mongoose, { ObjectId } from 'mongoose'

exports.ProductNeed_Get_All = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kasjer, Kucharz, Szef, Zastępca szefa'])
	} catch (error: any) {
		if (error.message == 'Autoryzacja nie powiodła się!') {
			res.status(401).send(error.message)
			return
		}
		if (error.message == 'Brak uprawnień!') {
			res.status(403).send(error.message)
		}
	}

	const page = (req.query.page as string) ?? null
	let pageNumber: number
	try {
		pageNumber = parseInt(page)
		if (pageNumber == 0) {
			pageNumber = 1
		}
	} catch (error) {
		pageNumber = 1
	}

	const sortBy = (req.query.sortby as string) ?? null
	const sort = (req.query.sort as string) ?? null
	let productNeeds: any
	if (sort) {
		productNeeds = await GetProductNeedsWithPageAndSort(pageNumber, sort, sortBy)
	} else {
		productNeeds = await GetProductNeedsWithPage(pageNumber)
	}
	if (!pageNumber || pageNumber == 0) pageNumber = 1

	const countPage = (await ProductNeedModel.countDocuments()) / 5
	if (!productNeeds) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		if (productNeeds.length > 0)
			res.status(200).send({
				Pages: pageNumber + '/' + Math.ceil(countPage),
				ProductsNeeds: productNeeds,
			})
		else res.status(200).send('Strona jest pusta. Ilość dostępnych stron: ' + Math.ceil(countPage))
	}
}

exports.ProductNeed_Get = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kasjer, Kucharz, Szef, Zastępca szefa'])
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
	const productNeed = await GetProductNeedById(id)

	if (!productNeed) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(productNeed)
	}
}

exports.ProductNeed_Post = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kucharz, Szef, Zastępca szefa'])
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
	const quantity = req.body.Quantity
	const unit = req.body.Unit
	try {
		const productNeed = new ProductNeedModel({
			Name: name,
			Quantity: quantity,
			Unit: unit,
		})
		await productNeed.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			ProductNeed: productNeed,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.ProductNeed_Put = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kasjer ,Kucharz, Szef, Zastępca szefa'])
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
	const productNeed = await GetProductNeedById(id)

	if (!productNeed) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await ProductNeedModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
						Quantity: req.body.Quantity,
						Unit: req.body.Unit,
					},
				}
			)
			productNeed!.Name = req.body.Name
			productNeed!.Quantity = req.body.Quantity
			productNeed!.Unit = req.body.Unit
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				ProductNeed: productNeed,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.ProductNeed_Delete = async function (req: Request, res: Response) {
	try {
		await CheckPermission(req, ['Kucharz, Szef, Zastępca szefa'])
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
	const productNeed = await GetProductNeedById(id)

	if (!productNeed) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await ProductNeedModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
