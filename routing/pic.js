const Controller = require("../controller/picController.js");
const router = require("express").Router();
const authentification = require("../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.get("/list", authentification, Controller.list);
router.get("/listByMasterCustomerId/:masterCustomerId",Controller.listByMasterCustomerId);
router.get("/listByMasterSupplierId/:masterSupplierId", Controller.listByMasterSupplierId);
router.get("/detailsById/:id", authentification, Controller.detailsById);
router.post("/update", authentification, Controller.update);
router.post("/delete", authentification, Controller.delete);

module.exports = router;
