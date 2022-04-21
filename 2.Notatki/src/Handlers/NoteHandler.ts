const routerNote = require('express').Router()
const Note_Controller = require('../Controllers/NoteController')

routerNote
	.get('/list', Note_Controller.Note_Get_By_User)
	.get('/list/public', Note_Controller.Note_Get_By_User_Public)
	.get('/list/private', Note_Controller.Note_Get_By_User_Private)
	.get('/:id', Note_Controller.Note_Get)
	.post('/', Note_Controller.Note_Post)
	.put('/:id', Note_Controller.Note_Put)
	.delete('/:id', Note_Controller.Note_Delete)
	// Admin
	.get('/list/all', Note_Controller.Note_Get_All)
	.get('/list/:id', Note_Controller.Note_Get_By_User_ID)

module.exports = routerNote
