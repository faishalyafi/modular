const Controller = require('./controller');
const router = require('express').Router();
const uploadPdf = require('../../helper/uploadPdf');

router.post('/register', uploadPdf, Controller.register);
router.get('/list', Controller.list);
router.get('/listByStatus/:statusPostLoker', Controller.listByStatus);
router.get('/detailListByStatus/:statusPostLoker/:postLokerId', Controller.detailListByStatus);
router.get('/detailsById/:id', Controller.detailsById);
router.post('/update', uploadPdf, Controller.update);
router.post('/delete', Controller.delete);
router.get('/jumlahPelamarByLoker', Controller.jumlahPelamarByLoker);
router.get('/listKebutuhanByPostLokerId/:postLokerId', Controller.listKebutuhanByPostLokerId);

module.exports = router
