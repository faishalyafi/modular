const Controller = require('../controller/postLokerController');
const router = require('express').Router();
// const upload = require('../helper/upload');
const uploadPdf = require('../helper/uploadPdf');
const authentification = require('../middleware/authentification');

router.post('/register', uploadPdf, Controller.register);
router.get('/list', Controller.list);
router.get('/listByStatus/:statusPostLoker', Controller.listByStatus);
router.get('/detailListByStatus/:statusPostLoker/:postLokerId', Controller.detailListByStatus);
router.get('/detailsById/:id', Controller.detailsById);
router.post('/update', uploadPdf, Controller.update);
router.post('/delete', Controller.delete);
router.get('/jumlahPelamarByLoker', Controller.jumlahPelamarByLoker);

module.exports = router
