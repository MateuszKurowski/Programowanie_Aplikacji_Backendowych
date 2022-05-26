const routerRaport = require('express').Router()
const Raport_Controller = require('../Controllers/RaportController')

routerRaport
	.get('/table', Raport_Controller.Raport_Get_Orders_Per_Table)
	.get('/employee', Raport_Controller.Raport_Get_Orders_Per_Employee)
	.get('/date', Raport_Controller.Raport_Get_Orders_In_Time)
	.get('/income', Raport_Controller.Raport_Get_Cash_In_Time)
module.exports = routerRaport
