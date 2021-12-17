const Controller = require( '../controller/unitController.js' );
const router = require( 'express' ).Router();
const authentification = require( '../middleware/authentification' )

router.post( '/register', authentification, Controller.register )
router.get( '/list', authentification, Controller.list )
router.get( '/detailsById/:id', authentification, Controller.detailsById )
router.post( '/update', authentification, Controller.update )
router.post( '/delete', authentification, Controller.delete )

module.exports = router