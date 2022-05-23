const routerMeal = require('express').Router()
const Meal_Controller = require('../Controllers/MealController')

routerMeal
	.get('/list', Meal_Controller.Meal_Get_All)
	.post('/', Meal_Controller.Meal_Post)
	.get('/:id', Meal_Controller.Meal_Get)
	.put('/:id', Meal_Controller.Meal_Put)
	.delete('/:id', Meal_Controller.Meal_Delete)

module.exports = routerMeal
