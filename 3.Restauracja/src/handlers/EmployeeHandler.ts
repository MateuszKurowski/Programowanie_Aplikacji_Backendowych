const routerEmployee = require('express').Router()
const Employee_Controller = require('../controllers/EmplyoeeController')

routerEmployee
	.get('/login', Employee_Controller.Employee_Login)
	.post('/', Employee_Controller.Employee_Post)
	.get('/', Employee_Controller.Employee_Get)
	.put('/', Employee_Controller.Employee_Put)
	.delete('/', Employee_Controller.Employee_Delete)
	.get('/list', Employee_Controller.Employee_Get_List_By_Id)
	.get('/:id', Employee_Controller.Employee_Get_By_Id)
	.put('/:id', Employee_Controller.Employee_Put_By_Id)
	.delete('/:id', Employee_Controller.Employee_Delete_By_Id)

module.exports = routerEmployee
