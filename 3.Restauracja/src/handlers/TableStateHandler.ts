const routerTableState = require('express').Router()
const TableState_Controller = require('../Controllers/TableStateController')

routerTableState
	.get('/list', TableState_Controller.TableState_Get_All)
	.post('/', TableState_Controller.TableState_Post)
	.get('/:id', TableState_Controller.TableState_Get)
	.put('/:id', TableState_Controller.TableState_Put)
	.delete('/:id', TableState_Controller.TableState_Delete)

module.exports = routerTableState
