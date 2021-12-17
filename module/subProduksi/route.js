const Controller = require("./controller");
const router = require("express").Router();
const authentification = require("../../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.get("/list", authentification, Controller.list);
router.get("/detailsById/:spId", authentification, Controller.detailsById);
router.post("/update", authentification, Controller.update);
// router.get("/listSubProduksiByProduksiId/:produksiId", authentification, Controller.listSubProduksiByProduksiId);
router.post("/listSubProduksiByProduksiId", authentification, Controller.listSubProduksiByProduksiId);
router.post("/delete", authentification, Controller.delete);
router.post("/deleteAll", authentification, Controller.deleteAll);

module.exports = router;
