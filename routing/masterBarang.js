const Controller = require("../controller/masterBarangController");
const upload = require("../helper/upload");
const authentification = require("../middleware/authentification");
const router = require("express").Router();

router.post("/register", authentification, upload, Controller.register);
router.post("/update", authentification, upload, Controller.update);
router.post("/delete", authentification, Controller.delete);
router.get("/detailsById/:id", authentification, Controller.detailsById);
router.get("/detailStockBarang/:idBarang", authentification, Controller.detailStockBarang); //idBarang
router.get("/list", authentification, Controller.list);
router.get("/listKodeBarang", authentification, Controller.listKodeBarang);
router.get("/listAllStockBarang", authentification, Controller.listAllStockBarang);
router.post("/listBarangByKategoriId", authentification, Controller.listBarangByKategoriId);

module.exports = router;
