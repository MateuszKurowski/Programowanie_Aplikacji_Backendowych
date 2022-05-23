const routerMealCategory = require('express').Router()
const MealCategory_Controller = require('../Controllers/MealCategoryController')

routerMealCategory
	.get('/list', MealCategory_Controller.MealCategory_Get_All)
	.post('/', MealCategory_Controller.MealCategory_Post)
	.get('/:id', MealCategory_Controller.MealCategory_Get)
	.put('/:id', MealCategory_Controller.MealCategory_Put)
	.delete('/:id', MealCategory_Controller.MealCategory_Delete)

module.exports = routerMealCategory
