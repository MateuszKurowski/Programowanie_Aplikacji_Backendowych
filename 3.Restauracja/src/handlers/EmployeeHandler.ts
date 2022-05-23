const routerEmployee = require('express').Router()
const Employee_Controller = require('../Controllers/EmployeeController')

routerEmployee
	.get('/list', Employee_Controller.Employee_Get_All)
	.post('/', Employee_Controller.Employee_Post)
	.get('/:id', Employee_Controller.Employee_Get)
	.put('/:id', Employee_Controller.Employee_Put)
	.delete('/:id', Employee_Controller.Employee_Delete)

module.exports = routerEmployee
