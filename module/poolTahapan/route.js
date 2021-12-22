const Controller = require( './controller' );
const router = require( 'express' ).Router();
const authentification = require( '../../middleware/authentification' );

router.post( '/register', authentification, Controller.register );
router.get( '/list', authentification, Controller.list);
router.get( '/detailsById/:id', authentification, Controller.detailsById); //req.params statusSurvey
router.get( '/listTahapanByPostLokerId/:postLokerId', authentification, Controller.listTahapanByPostLokerId); //req.params postLokerId
router.post( '/update', authentification, Controller.update );
router.post( '/delete', authentification, Controller.delete );

module.exports = router
