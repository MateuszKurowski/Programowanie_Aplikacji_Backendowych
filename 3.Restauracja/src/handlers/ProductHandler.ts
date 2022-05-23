const routerProduct = require('express').Router()
const Product_Controller = require('../Controllers/ProductController')

routerProduct
	.get('/list', Product_Controller.Product_Get_All)
	.post('/', Product_Controller.Product_Post)
	.get('/:id', Product_Controller.Product_Get)
	.put('/:id', Product_Controller.Product_Put)
	.delete('/:id', Product_Controller.Product_Delete)

module.exports = routerProduct
