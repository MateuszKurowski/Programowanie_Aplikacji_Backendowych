const routerEmployee = require('express').Router()
const Employee_Controller = require('../controllers/EmplyoeeController')

routerEmployee
	.get('/login', Employee_Controller.Employee_Login)
	.post('/', Employee_Controller.Employee_Post)
	.get('/:id', Employee_Controller.Employee_Get)
// .put('/:id', Employee_Controller.Employee_Put)
// .delete('/:id', Employee_Controller.Employee_Delete)

module.exports = routerEmployee
