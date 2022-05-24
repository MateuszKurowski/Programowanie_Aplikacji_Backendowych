import { Response, Request } from 'express'
import { CheckPermission } from '../utility/Token'
import { GetProducts, GetProductById, ProductModel } from '../entities/Product'
import { ObjectId } from 'mongoose'

exports.Product_Get_All = async function (req: Request, res: Response) {
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

	const Products = await GetProducts()

	if (!Products) {
		res.status(204).send('Tabela jest pusta.')
	} else {
		res.status(200).send(Products)
	}
}

exports.Product_Post = async function (req: Request, res: Response) {
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
		const product = await new ProductModel({
			Name: name,
		})
		await product.save()
		res.status(201).send({
			Message: 'Dodawanie powiodło się.',
			Product: product,
		})
	} catch (error: any) {
		res.status(500).send({
			Message: 'Dodawanie nie powiodło się!',
			Error: error._message,
		})
	}
}

exports.Product_Get = async function (req: Request, res: Response) {
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
	const product = await GetProductById(id)

	if (!product) {
		res.status(404).send('Wynik jest pusty.')
	} else {
		res.status(200).send(product)
	}
}

exports.Product_Put = async function (req: Request, res: Response) {
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
	const product = await GetProductById(id)

	if (!product) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await ProductModel.updateOne(
			{ _id: id },
			{
				$set: {
					Name: req.body.Name,
				},
			}
		)
		product.Name = req.body.Name
		res.status(200).send({
			Message: 'Operacja powiodła się.',
			Product: product,
		})
	}
}

exports.Product_Delete = async function (req: Request, res: Response) {
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
	const product = await GetProductById(id)

	if (!product) {
		res.status(404).send('Nie odnaleziono rekordu z podanym ID.')
	} else {
		await ProductModel.deleteOne({ _id: id })
		res.status(200).send('Rekord został usunięty.')
	}
}
