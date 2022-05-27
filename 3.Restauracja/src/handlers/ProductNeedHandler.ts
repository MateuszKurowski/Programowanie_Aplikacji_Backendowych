const routerProductNeed = require('express').Router()
const ProductNeed_Controller = require('../controllers/ProductNeedContoller')

routerProductNeed
	.get('/list', ProductNeed_Controller.ProductNeed_Get_All)
	.post('/', ProductNeed_Controller.ProductNeed_Post)
	.get('/:id', ProductNeed_Controller.ProductNeed_Get)
	.put('/:id', ProductNeed_Controller.ProductNeed_Put)
	.delete('/:id', ProductNeed_Controller.ProductNeed_Delete)

module.exports = routerProductNeed
