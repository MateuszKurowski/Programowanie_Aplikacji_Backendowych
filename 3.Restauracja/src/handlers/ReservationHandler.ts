const routerReservation = require('express').Router()
const Reservation_Controller = require('../Controllers/ReservationController')

routerReservation
	.get('/list', Reservation_Controller.Reservation_Get_All)
	.post('/', Reservation_Controller.Reservation_Post)
	.get('/:id', Reservation_Controller.Reservation_Get)
	.put('/:id', Reservation_Controller.Reservation_Put)
	.delete('/:id', Reservation_Controller.Reservation_Delete)

module.exports = routerReservation
