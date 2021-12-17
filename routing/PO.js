const Controller = require("../controller/poController");
const router = require("express").Router();
const authentification = require("../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.get("/list", authentification, Controller.list);
router.get("/generateNoPO", authentification, Controller.generateNoPO);
router.get("/listCCByNoPO/:nomorPO", authentification, Controller.listCCByNoPO); //nomorPO
router.get("/listBarangByNoPO/:nomorPO",authentification,Controller.listBarangByNoPO); //nomorPO
router.post("/update", authentification, Controller.update);
// router.post("/updateCC", authentification, Controller.updateCC);
// router.post("/updateSubPO", authentification, Controller.updateSubPO);
router.post("/delete", authentification, Controller.delete);
router.post("/hargaPOTerahir", authentification, Controller.hargaPOTerahir);
router.get("/listAllLaporanPO", authentification, Controller.listAllLaporanPO);
router.post("/searchLaporanPO", authentification, Controller.searchLaporanPO);

module.exports = router;
