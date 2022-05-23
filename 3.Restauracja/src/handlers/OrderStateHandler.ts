const routerOrderState = require('express').Router()
const OrderState_Controller = require('../Controllers/OrderStateController')

routerOrderState
	.get('/list', OrderState_Controller.OrderState_Get_All)
	.post('/', OrderState_Controller.OrderState_Post)
	.get('/:id', OrderState_Controller.OrderState_Get)
	.put('/:id', OrderState_Controller.OrderState_Put)
	.delete('/:id', OrderState_Controller.OrderState_Delete)

module.exports = routerOrderState
