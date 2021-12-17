const Controller = require( './controller' );
const router = require( 'express' ).Router();
const authentification = require( '../../middleware/authentification' );

router.post( '/register', authentification, Controller.register );
router.get( '/list', authentification, Controller.list);
router.get( '/detailsById/:id', authentification, Controller.detailsById); //req.params statusSurvey
router.get( '/detailsByToko/:kategoriToko', authentification, Controller.detailsByToko);
router.post( '/update', authentification, Controller.update );
router.post( '/delete', authentification, Controller.delete );
router.get( '/listBarangByMasterKategoriHargaId/:masterKategoriHargaId', authentification, Controller.listBarangByMasterKategoriHargaId );
router.post( '/bulkHargaJual', authentification, Controller.bulkHargaJual);

module.exports = router