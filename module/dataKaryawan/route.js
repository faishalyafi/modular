const Controller = require( './controller');
const router = require( 'express' ).Router();
const authentification = require( '../../middleware/authentification');
const upload = require("../../helper/upload");


router.post( '/register', authentification, Controller.register );
router.post( '/update', authentification,upload, Controller.update);
router.post( '/delete', authentification, Controller.delete);
router.get( '/list', authentification, Controller.list);
router.get( '/detailsById/:dataKaryawanId', authentification, Controller.detailsById );
router.get('/listByMasterPosisiId/:masterPosisiId', authentification, Controller.listByMasterPosisiId);
router.get('/listByMasterDivisiId/:masterDivisiId', authentification, Controller.listByMasterDivisiId);

module.exports = router