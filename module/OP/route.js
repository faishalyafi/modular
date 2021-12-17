const Controller = require("./controller");
const authentification = require("../../middleware/authentification");
const router = require("express").Router();

router.post("/register", authentification, Controller.register);
router.post("/updateOP", authentification, Controller.updateOP);
router.post("/updateSubOP", authentification, Controller.updateSubOP);
router.get("/generateNoOP", authentification, Controller.generateNoOP);
router.post("/listBarangOPByNoOP/", authentification, Controller.listBarangOPByNoOP); //nomorOP && kategoriHargaId
router.get("/list", authentification, Controller.list);
router.post("/listOPBySales", authentification, Controller.listOPBySales);
router.get("/listAllLaporanOP", authentification, Controller.listAllLaporanOP);
router.post("/searchLaporanOP", authentification, Controller.searchLaporanOP);
router.get("/listByStatusOP/:statusOP", authentification, Controller.listByStatusOP); //statusOP
router.get("/detailsOPByNoOP/:nomorOP", authentification, Controller.detailsOPByNoOP); //nomorOP
router.get("/pendingOrder", authentification, Controller.pendingOrder);
router.get("/listAllPencapaianSales", authentification, Controller.listAllPencapaianSales);
router.get("/listAllPenjualanHariIni", authentification, Controller.listAllPenjualanHariIni);
router.get("/listAllPenjualanSatuBulan", authentification, Controller.listAllPenjualanSatuBulan);
router.post("/acceptedOP/", authentification, Controller.acceptedOP); //nomorOP
router.get('/grafikPenjualanPertahun/:tahun',authentification,Controller.grafikPenjualanPertahun)
// router.post("/delete", authentification, Controller.delete);
// router.get("/listBarangOPByNoOP/:nomorOP", authentification, Controller.listBarangOPByNoOP); //nomorOP

module.exports = router;
