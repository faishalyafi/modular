const Controller = require('./controller');
const router = require('express').Router();
const uploadKelengkapan = require("../../helper/uploadKelengkapan");
const authentification = require('../../middleware/authentification');

router.post('/register', Controller.register);
router.get('/list', Controller.list);
router.get('/detailsById/:id', Controller.detailsById);
router.post('/updateAll', Controller.updateAll);
router.post('/updateFile',uploadKelengkapan,Controller.updateFile);
router.post('/update', Controller.update);
router.post('/delete', Controller.delete);
router.get('/detailKelengkapan', Controller.detailKelengkapan);

module.exports = router
