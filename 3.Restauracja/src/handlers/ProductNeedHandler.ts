const routerProductNeed = require('express').Router()
const ProductNeed_Controller = require('../Controllers/ProductNeedController')

routerProductNeed
	.get('/list', Product_Controller.ProductNeed_Get_All)
	.post('/', Product_Controller.ProductNeed_Post)
	.get('/:id', Product_Controller.ProductNeed_Get)
	.put('/:id', Product_Controller.ProductNeed_Put)
	.delete('/:id', Product_Controller.ProductNeed_Delete)

module.exports = routerProductNeed
