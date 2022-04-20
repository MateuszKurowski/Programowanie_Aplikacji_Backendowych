const router = require('express').Router()
const Note_Controller = require('../Handlers/Controllers/NoteController')

router
	.get('/list', Note_Controller.Note_Get_By_User) // Not implemented
	.get('/:id', Note_Controller.Note_Get)
	.post('/', Note_Controller.Note_Post)
	.put('/:id', Note_Controller.Note_Put)
	.delete('/:id', Note_Controller.Note_Delete)
	// Admin
	.get('/list/all', Note_Controller.Note_Get_All) // Not implemented
	.get('/list/:id', Note_Controller.Note_Get_By_User_ID) // Not implemented

module.exports = router
