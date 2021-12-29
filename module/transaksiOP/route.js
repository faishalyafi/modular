const Controller = require("./controller");
const authentification = require("../../middleware/authentification");
const router = require("express").Router();

router.post("/register", authentification, Controller.register);
router.post("/updateTransaksiOP", authentification, Controller.updateTransaksiOP);
router.post("/rescheduleTransaksiOP", authentification, Controller.rescheduleTransaksiOP);
// router.post("/updateSubOP", authentification, Controller.updateSubOP);
router.get("/generateNoDO", authentification, Controller.generateNoDO);
// router.get("/listBarangOPByNoOP/:nomorOP", authentification, Controller.listBarangOPByNoOP); //nomorOP
router.get("/listAllTransaksiOP", authentification, Controller.listAllTransaksiOP);
router.get("/listTransaksiOPById/:id", authentification, Controller.listTransaksiOPById);
router.get("/detailsOPByTransaksiId/:idTransaksi", authentification, Controller.detailsOPByTransaksiId);
router.get("/listTransaksiOPByNoOP/:nomorOP", authentification, Controller.listTransaksiOPByNoOP);
// router.post("/delete", authentification, Controller.delete);

module.exports = router;
