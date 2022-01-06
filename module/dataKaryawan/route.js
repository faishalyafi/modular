const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');
const upload = require("../../helper/upload");


router.post('/register', authentification, Controller.register);
router.post('/update', authentification, upload, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.post('/pecatKaryawan', authentification, Controller.pecatKaryawan);
router.get('/list', authentification, Controller.list);
router.get('/detailsById/:dataKaryawanId', authentification, Controller.detailsById);
router.get('/listByMasterPosisiId/:masterPosisiId', authentification, Controller.listByMasterPosisiId);
router.get('/listByMasterDivisiId/:masterDivisiId', authentification, Controller.listByMasterDivisiId);
router.get('/listByMasterShiftId/:masterShiftId', authentification, Controller.listByMasterShiftId);
router.get('/listKaryawanByStatus/:statusKerjaKaryawan', authentification, Controller.listKaryawanByStatus);
router.get('/listKaryawanWNA', authentification, Controller.listKaryawanWNA);

module.exports = router