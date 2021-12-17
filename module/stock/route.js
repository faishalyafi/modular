const Controller = require("./controller");
const router = require("express").Router();
const authentification = require("../../middleware/authentification");


router.get("/listAllStock", authentification, Controller.listAllstock);
router.get("/listStockByBatchNumber/:batchNumber", authentification, Controller.listStockByBatchNumber);
router.get("/listBarangStockByMbId/:id", authentification, Controller.listBarangStockByMbId);
router.get("/listAllBarangGudang", authentification, Controller.listAllBarangGudang);
router.get("/listDetailsBatchBarang/:gudangId/:masterBarangId", authentification, Controller.listDetailsBatchBarang);
router.get("/listSearch/:namaGudang", authentification, Controller.listSearch);

module.exports = router;
