const routerRestaurant = require('express').Router()
const Restaurant_Controller = require('../Controllers/RestaurantController')

routerRestaurant
	//.get('/list', Restaurant_Controller.Restaurant_Get_All)
	.post('/', Restaurant_Controller.Restaurant_Post)
	.get('/:id', Restaurant_Controller.Restaurant_Get)
	.put('/:id', Restaurant_Controller.Restaurant_Put)
	.delete('/:id', Restaurant_Controller.Restaurant_Delete)

module.exports = routerRestaurant
