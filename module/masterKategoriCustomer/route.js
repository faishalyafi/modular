const Controller = require( './controller' )
const router = require( 'express' ).Router();
const authentification = require( '../../middleware/authentification' )

router.post( '/register', authentification, Controller.register )
router.get( '/list', authentification, Controller.list )
router.get( '/detailsById/:id', authentification, Controller.detailsById )
router.get('/listByMasterCustomerCategoryId/:id', authentification, Controller.listByMasterCustomerCategoryId)
router.post( '/update', authentification, Controller.update )
router.post( '/delete', authentification, Controller.delete )

module.exports = router