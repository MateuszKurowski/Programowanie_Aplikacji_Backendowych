import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetProducts, GetProductById, ProductModel, GetProductsWithPage } from '../entities/Product'
import { ObjectId } from 'mongoose'

exports.Product_Get_All = async function (req: Request, res: Response) {
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
	let products: any
	if (sort) {
		switch (sort.toLowerCase()) {
			default:
			case 'desc':
				switch (sortBy.toLowerCase()) {
					case 'unit':
						products = (await GetProductsWithPage(pageNumber)).sort((one, two) => (one.Unit > two.Unit ? -1 : 1))
						break
					case 'quantity':
						products = (await GetProductsWithPage(pageNumber)).sort((one, two) =>
							one.Quantity > two.Quantity ? -1 : 1
						)
						break
					case 'price':
						products = (await GetProductsWithPage(pageNumber)).sort((one, two) => (one.Price > two.Price ? -1 : 1))
						break
					case 'name':
					default:
						products = (await GetProductsWithPage(pageNumber)).sort((one, two) => (one.Name > two.Name ? -1 : 1))
						break
				}
				break
			case 'asc':
				switch (sortBy.toLowerCase()) {
					case 'unit':
						products = (await GetProductsWithPage(pageNumber)).sort((one, two) => (one.Unit < two.Unit ? -1 : 1))
						break
					case 'quantity':
						products = (await GetProductsWithPage(pageNumber)).sort((one, two) =>
							one.Quantity < two.Quantity ? -1 : 1
						)
						break
					case 'price':
						products = (await GetProductsWithPage(pageNumber)).sort((one, two) => (one.Price < two.Price ? -1 : 1))
						break
					case 'name':
					default:
						products = (await GetProductsWithPage(pageNumber)).sort((one, two) => (one.Name < two.Name ? -1 : 1))
						break
				}
				break
		}
	} else {
		products = await GetProducts()
	}

	if (!products) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(products)
	}
}

exports.Product_Post = async function (req: Request, res: Response) {
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

	const name = req.body.Name
	const price = req.body.Price
	const quantity = req.body.Quantity
	const unit = req.body.Unit
	try {
		const product = new ProductModel({
			Name: name,
			Price: price,
			Quantity: quantity,
			Unit: unit,
		})
		await product.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Product: product,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			error: error.message,
		})
	}
}

exports.Product_Get = async function (req: Request, res: Response) {
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
	const product = await GetProductById(id)

	if (!product) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(product)
	}
}

exports.Product_Put = async function (req: Request, res: Response) {
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
	const product = await GetProductById(id)

	if (!product) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await ProductModel.updateOne(
				{ _id: id },
				{
					$set: {
						Name: req.body.Name,
						Price: req.body.Price,
						Quantity: req.body.Quantity,
						Unit: req.body.Unit,
					},
				}
			)
			product!.Name = req.body.Name
			product!.Price = req.body.Price
			product!.Quantity = req.body.Quantity
			product!.Unit = req.body.Unit
			res.status(200).send({
				Message: 'Operacja powiodła się.',
				Product: product,
			})
		} catch (error: any) {
			res.status(400).send(error.message)
		}
	}
}

exports.Product_Delete = async function (req: Request, res: Response) {
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
	const product = await GetProductById(id)

	if (!product) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		try {
			await ProductModel.deleteOne({ _id: id })
			res.status(200).send('Rekord został usunięty.')
		} catch (error: any) {
			res.status(500).send(error.message)
		}
	}
}
