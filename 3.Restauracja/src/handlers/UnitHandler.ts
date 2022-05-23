const routerUnit = require('express').Router()
const Unit_Controller = require('../Controllers/UnitController')

routerUnit
	.get('/list', Unit_Controller.Unit_Get_All)
	.post('/', Unit_Controller.Unit_Post)
	.get('/:id', Unit_Controller.Unit_Get)
	.put('/:id', Unit_Controller.Unit_Put)
	.delete('/:id', Unit_Controller.Unit_Delete)

module.exports = routerUnit
