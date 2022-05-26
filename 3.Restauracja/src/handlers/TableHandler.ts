const routerTable = require('express').Router()
const Table_Controller = require('../Controllers/TableController')

routerTable
	.get('/list', Table_Controller.Table_Get_All)
	.get('/list/status', Table_Controller.Table_Get_All_With_Status)
	.get('/list/available', Table_Controller.Table_Get_All_Available)
	.get('/list/busy', Table_Controller.Table_Get_All_Busy)
	.post('/', Table_Controller.Table_Post)
	.get('/:id', Table_Controller.Table_Get)
	.put('/:id', Table_Controller.Table_Put)
	.delete('/:id', Table_Controller.Table_Delete)

module.exports = routerTable
