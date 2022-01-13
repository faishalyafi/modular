const Controller = require("./controller");
const router = require("express").Router();
const authentification = require("../../middleware/authentification");
const uploadMobile = require('../../helper/uploadMobile')

router.get('/jumlahTokoBySalesLogin',authentification,Controller.jumlahTokoBySalesLogin);
router.get('/totalOmsetBySalesLogin',authentification,Controller.totalOmsetBySalesLogin)
router.get('/tokoTerbaikBySalesLogin',authentification,Controller.tokoTerbaikBySalesLogin)
router.post('/registerToko',authentification,uploadMobile,Controller.registerToko)
router.post('/updateToko',authentification,uploadMobile,Controller.updateToko)
router.get('/totalOmset/:range',authentification,Controller.totalOmset)
router.get('/listTokoByStatusAndSalesLogin/:statusSurvey',authentification,Controller.listTokoByStatusAndSalesLogin)
router.get('/jumlahRiwayatPembelianToko/:masterCustomerId',authentification,Controller.jumlahRiwayatPembelianToko)
router.get('/rekapProdukPerToko/:masterBarangId/:masterCustomerId',authentification,Controller.rekapProdukPerToko)
router.get('/listCustomerBySalesMobile/:halaman',authentification,Controller.listCustomerBySalesMobile)
router.get('/listOPBySalesMobile/:halaman',authentification,Controller.listOPBySalesMobile)
router.get('/listCustomersudahOrder/:halaman',authentification,Controller.listCustomersudahOrder)
router.get('/listCustomerBelumApprove/:halaman',authentification,Controller.listCustomerBelumApprove)
router.get('/listCustomerBelumOrder/:halaman',authentification,Controller.listCustomerBelumOrder)
router.get('/listJadwalPengirimanMobile/:halaman',authentification,Controller.listJadwalPengirimanMobile)
router.get('/listJadwalBatalMobile/:halaman',authentification,Controller.listJadwalBatalMobile)
router.get('/listBarangSalesMobile/:halaman',authentification,Controller.listBarangSalesMobile)
router.post('/listSOBySalesMobile',authentification,Controller.listSOBySalesMobile)
router.get('/listPiutangPerToko/:masterCustomerId', authentification,Controller.listPiutangPerToko)

module.exports = router;
