const routerRaport = require('express').Router()
const Raport_Controller = require('../Controllers/RaportController')

routerRaport
	.post('/', Raport_Controller.Raport_Post)
	.post('/', Raport_Controller.Raport_Post)
	.post('/', Raport_Controller.Raport_Post)
	.post('/', Raport_Controller.Raport_Post)
	.post('/', Raport_Controller.Raport_Post)

module.exports = routerRaport
