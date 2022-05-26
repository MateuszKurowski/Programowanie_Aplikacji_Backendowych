import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetProductNeedById, GetProductNeeds, GetProductNeedsWithPage, ProductNeedModel } from '../entities/ProductNeed'
import { ObjectId } from 'mongoose'

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
		switch (sort.toLowerCase()) {
			default:
			case 'desc':
				switch (sortBy.toLowerCase()) {
					case 'unit':
						productNeeds = (await GetProductNeedsWithPage(pageNumber)).sort((one, two) =>
							one.Unit > two.Unit ? -1 : 1
						)
						break
					case 'quantity':
						productNeeds = (await GetProductNeedsWithPage(pageNumber)).sort((one, two) =>
							one.Quantity > two.Quantity ? -1 : 1
						)
						break
					case 'name':
					default:
						productNeeds = (await GetProductNeedsWithPage(pageNumber)).sort((one, two) =>
							one.Name > two.Name ? -1 : 1
						)
						break
				}
				break
			case 'asc':
				switch (sortBy.toLowerCase()) {
					case 'unit':
						productNeeds = (await GetProductNeedsWithPage(pageNumber)).sort((one, two) =>
							one.Unit < two.Unit ? -1 : 1
						)
						break
					case 'quantity':
						productNeeds = (await GetProductNeedsWithPage(pageNumber)).sort((one, two) =>
							one.Quantity < two.Quantity ? -1 : 1
						)
						break
					case 'name':
					default:
						productNeeds = (await GetProductNeedsWithPage(pageNumber)).sort((one, two) =>
							one.Name < two.Name ? -1 : 1
						)
						break
				}
				break
		}
	} else {
		productNeeds = await GetProductNeeds()
	}

	if (!productNeeds) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(productNeeds)
	}
}

exports.ProductNeed_Get = async function (req: Request, res: Response) {
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

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
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

	if (!req.params.id) res.status(400).send('Nieprawidłowe ID.')
	const id = req.params.id as unknown as ObjectId
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
