const Controller = require( '../controller/absensiSalesController' )
const router = require( 'express' ).Router();
const authentification = require( '../middleware/authentification' )
const uploadMobile=require('../helper/uploadMobile')

router.post( '/checkIn', authentification,uploadMobile,Controller.checkIn )
router.get( '/findCheckOut', authentification, Controller.findCheckOut )
// router.get( '/detailsById/:id', authentification, Controller.detailsById )
router.post( '/checkOut', authentification, Controller.checkOut )



module.exports = router