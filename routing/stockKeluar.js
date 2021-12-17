const Controller = require("../controller/stockKeluarController");
const router = require("express").Router();
const authentification = require("../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.post("/update", authentification, Controller.update);
router.get("/list", authentification, Controller.list);
router.get("/listBarangKeluarByBatchNumber/:batch", authentification, Controller.listBarangKeluarByBatchNumber);
router.get("/detailsById/:skId", authentification, Controller.detailsById);
router.post("/delete", authentification, Controller.delete);

module.exports = router;
