const Controller = require('../controller/formulaController')
const router = require('express').Router();
const authentification = require('../middleware/authentification')

router.post( '/register', authentification, Controller.register)
router.get( '/list', authentification, Controller.list )
router.get( '/detailsByFormulaId/:idFormula', authentification, Controller.detailsFormulaById ) //idFormula
// router.post( '/updateIsActive', authentification, Controller.updateIsActive)
router.post( '/delete', authentification, Controller.delete )

module.exports = router