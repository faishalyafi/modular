const Controller = require( '../controller/customerController' );
const router = require( 'express' ).Router();
const authentification = require( '../middleware/authentification' );
const upload = require('../helper/upload')
const uploadMobile=require('../helper/uploadMobile')

router.post( '/register', authentification,upload, Controller.register );
router.get( '/list', authentification, Controller.list );
router.get( '/detailsById/:id', authentification, Controller.detailsById );
router.get( '/listByStatus/:statusSurvey', authentification, Controller.listByStatus ); //req.params statusSurvey
router.get( '/listLaporanCustomer', authentification, Controller.listLaporanCustomer );
router.post( '/update', authentification,upload, Controller.update );
router.post( '/updateMobile', authentification,uploadMobile, Controller.update );
router.post( '/delete', authentification, Controller.delete );
router.post( '/poolHargaJual', authentification, Controller.poolHargaJual);

module.exports = router