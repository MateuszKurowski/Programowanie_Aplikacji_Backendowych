const routerPosition = require('express').Router()
const Position_Controller = require('../Controllers/PositionController')

routerPosition
	.get('/list', Position_Controller.Position_Get_All)
	.get('/list/employees', Position_Controller.Position_Get_Employees)
	.post('/', Position_Controller.Position_Post)
	.get('/:id', Position_Controller.Position_Get)
	.put('/:id', Position_Controller.Position_Put)
	.delete('/:id', Position_Controller.Position_Delete)

module.exports = routerPosition
