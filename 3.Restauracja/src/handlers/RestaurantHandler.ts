const routerRestaurant = require('express').Router()
const Restaurant_Controller = require('../Controllers/RestaurantController')

routerRestaurant
	.get('/list', Restaurant_Controller.Restaurant_Get_All)
	.post('/', Restaurant_Controller.Restaurant_Post)
	.get('/', Restaurant_Controller.Restaurant_Main_Get) // TODO
	.get('/info', Restaurant_Controller.Restaurant_Main_Get)
	.get('/about', Restaurant_Controller.Restaurant_Main_Get)
	.get('/:id', Restaurant_Controller.Restaurant_Get)
	.put('/:id', Restaurant_Controller.Restaurant_Put)
	.delete('/:id', Restaurant_Controller.Restaurant_Delete)

module.exports = routerRestaurant
