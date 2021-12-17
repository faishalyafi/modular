const Controller = require("./controller");
const router = require("express").Router();
const authentification = require("../../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.get("/list", authentification, Controller.list);
router.get("/listByMasterCustomerId/:masterCustomerId",authentification,Controller.listByMasterCustomerId);
router.get("/listByMasterSupplierId/:masterSupplierId",authentification,Controller.listByMasterSupplierId);
router.get("/detailsById/:id", authentification, Controller.detailsById);
router.post("/update", authentification, Controller.update);
router.post("/delete", authentification, Controller.delete);
router.post("/bulk", Controller.bulk);

module.exports = router;
