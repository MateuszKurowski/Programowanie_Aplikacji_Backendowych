const routerUser = require('express').Router()
const User_Controller = require('../Controllers/UserController')

routerUser
	.get('/token', User_Controller.User_Login)
	.get('/', User_Controller.User_Get)
	.post('/', User_Controller.User_Post)
	.put('/', User_Controller.User_Put)
	.delete('/', User_Controller.User_Delete)
	//Admin
	.get('/list', User_Controller.User_Get_All)
	.get('/:id', User_Controller.User_Get_By_Id)
	.put('/:id', User_Controller.User_Put_By_Id)
	.delete('/:id', User_Controller.User_Delete_By_Id)

module.exports = routerUser
