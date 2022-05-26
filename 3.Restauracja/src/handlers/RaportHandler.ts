const routerRaport = require('express').Router()
const Raport_Controller = require('../Controllers/RaportController')

routerRaport
	.get('/', Raport_Controller.Raport_Get_Orders_Per_Table)
	.get('/', Raport_Controller.Raport_Get_Orders_Per_Employee)
	.get('/', Raport_Controller.Raport_Get_Orders_In_Time)
	.get('/', Raport_Controller.Raport_Get_Cash_In_Time)
module.exports = routerRaport
