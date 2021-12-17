const Controller = require("./controller");
const router = require("express").Router();
const authentification = require("../../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.get("/list", authentification, Controller.list);
router.get("/generateNoPR", authentification, Controller.generateNoPR);
router.get("/listCCByNoPR/:nomorPR", authentification, Controller.listCCbyNoPR); //nomorPO
router.get("/listBarangByNoPR/:nomorPR",authentification,Controller.listBarangByNoPR); //nomorPO
router.get("/listByStatusPR/:statusPR",authentification,Controller.listByStatusPR);
router.post("/update", authentification, Controller.update);
// router.post("/updateCC", authentification, Controller.updateCC);
// router.post("/updateSubPO", authentification, Controller.updateSubPO);
router.post("/delete", authentification, Controller.delete);
router.post("/acceptPO", authentification, Controller.acceptPO);
// router.post("/hargaPOTerahir", authentification, Controller.hargaPOTerahir);
// router.get("/listAllLaporanPO", authentification, Controller.listAllLaporanPO);
// router.post("/searchLaporanPO", authentification, Controller.searchLaporanPO);

module.exports = router;
