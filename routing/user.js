const Controller = require('../controller/userController.js')
const router = require('express').Router()
const authentification= require('../middleware/authentification')
const uploadMobile=require('../helper/uploadMobile')
const upload = require('../helper/upload')

router.post('/register',Controller.register)
router.post('/login',Controller.login)
router.get('/profil',authentification,Controller.profil)
router.post('/update',authentification,upload,Controller.update) 
router.post('/updateMobile',authentification,uploadMobile,Controller.update)
router.post('/delete',authentification,Controller.delete)
router.get('/ALL',authentification,Controller.ALL)
router.get('/listByRole/:masterDivisiId',authentification,Controller.listByMasterDivisiId)
router.get('/listUserByDivisiKode/:kodeDivisi',authentification,Controller.listUserByDivisiKode);
router.get('/checkAuthentification',Controller.checkAuthentification)
router.post('/loginMobileSales',Controller.loginMobileSales)

module.exports=router