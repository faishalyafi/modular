const Controller = require( './controller');
const router = require('express').Router();
const authentification = require( '../../middleware/authentification' );

router.post( '/register', authentification, Controller.register );
router.post( '/update', authentification, Controller.update);
router.post( '/delete', authentification, Controller.delete);
router.get( '/list', authentification, Controller.list);
// router.get( '/detailsById/:dataKaryawanId', authentification, Controller.detailsById );
router.get('/listByMasterAsuransiId/:masterAsuransiId', authentification, Controller.listByMasterAsuransiId);
router.get('/listByDataKaryawanId/:dataKaryawanId', authentification, Controller.listByDataKaryawanId);

module.exports = router