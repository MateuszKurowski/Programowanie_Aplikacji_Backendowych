const routerOrder = require('express').Router()
const Order_Controller = require('../Controllers/OrderController')

routerOrder
	.get('/list', Order_Controller.Order_Get_All)
	.post('/', Order_Controller.Order_Post)
	.get('/:id', Order_Controller.Order_Get)
	.put('/:id', Order_Controller.Order_Put)
	.delete('/:id', Order_Controller.Order_Delete)

module.exports = routerOrder
