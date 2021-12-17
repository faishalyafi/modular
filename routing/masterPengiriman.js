const Controller = require("../controller/masterPengirimanController");
const authentification = require("../middleware/authentification");
const router = require("express").Router();

router.post("/register", authentification, Controller.register);
router.post("/update", authentification, Controller.update);
router.post("/delete", authentification, Controller.delete);
router.get("/detailsById/:id", authentification, Controller.detailsById);
router.get("/detailsByNomor/:nomorPengiriman", authentification, Controller.detailsByNomor);
router.get("/list", authentification, Controller.list);

module.exports = router;
