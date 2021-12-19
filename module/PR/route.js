const Controller = require("./controller");
const router = require("express").Router();
const authentification = require("../../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.get("/list", authentification, Controller.list);
router.get("/generateNoPR", authentification, Controller.generateNoPR);
router.get("/listBarangByNoPR/:nomorPR",authentification,Controller.listBarangByNoPR); //nomorPO
router.get("/listByStatusPR/:statusPR",authentification,Controller.listByStatusPR);
router.post("/update", authentification, Controller.update);
router.post("/delete", authentification, Controller.delete);

module.exports = router;
