const Tag_Controller = require('../Handlers/Controllers/TagController')

router
	.get('/list', Tag_Controller.Tag_Get_All)
	.post('/', Tag_Controller.Tag_Post)
	.get('/:id', Tag_Controller.Tag_Get)
	.put('/:id', Tag_Controller.Tag_Put)
    .delete('/:id', Tag_Controller.Tag_Delete)

module.exports = router
