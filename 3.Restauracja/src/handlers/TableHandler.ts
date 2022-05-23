const routerTable = require('express').Router()
const Table_Controller = require('../Controllers/TableController')

routerTable
	.get('/list', Table_Controller.Table_Get_All)
	.post('/', Table_Controller.Table_Post)
	.get('/:id', Table_Controller.Table_Get)
	.put('/:id', Table_Controller.Table_Put)
	.delete('/:id', Table_Controller.Table_Delete)

module.exports = routerTable
