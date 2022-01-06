const Controller = require("./controller");
const router = require("express").Router();
const authentification = require("../../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.post("/update", authentification, Controller.update);
router.post("/delete", authentification, Controller.delete);
router.get("/detailsById/:id", authentification, Controller.detailsById);
router.get("/detailsTransaksiByNomorPO/:nomorPO",authentification,Controller.detailsTransaksiByNomorPO);
router.get("/listTransaksiPObyNomerPO/:nomorPO",authentification,Controller.listTransaksiPObyNomerPO);
router.get("/historyAllTransaksi",authentification,Controller.historyAllTransaksi);
router.get("/listAllTransaksi", authentification, Controller.listAllTransaksi);
// router.post("/updateBarang", authentification, Controller.updateBarang);

module.exports = router;
