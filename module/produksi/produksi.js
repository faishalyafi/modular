const Controller = require("./produksiController.js");
const router = require("express").Router();
const authentification = require("../../middleware/authentification");

router.post("/register", authentification, Controller.register);
router.get("/list", authentification, Controller.list);
router.get("/detailsById/:id", authentification, Controller.detailsById);
router.post("/update", authentification, Controller.update);
// router.post("/subProduksi", authentification, Controller.registerSubProduksi);
// router.post("/updateSubProduksi", authentification, Controller.updateSubProduksi);
router.post("/delete", authentification, Controller.delete);
// router.get("/listAllPlanning", authentification, Controller.listAllPlanning);
// router.get("/listAllRealisasi", authentification, Controller.listAllRealisasi);
router.get("/listByStatusProduksi/:statusProduksi", authentification, Controller.listByStatusProduksi );
router.get("/detailsListByStatusProduksi/:statusProduksi/:produksiId", authentification, Controller.detailsListByStatusProduksi);
router.get("/listALLCancelProduksi", authentification, Controller.listALLCancelProduksi);
router.get("/listAllActiveProduksi", authentification, Controller.listAllActiveProduksi);
router.get("/detailsBrangByProduksiId/:pId", authentification, Controller.detailsBrangByProduksiId);

module.exports = router;
