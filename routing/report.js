const Controller = require("../controller/reportController");
const router = require("express").Router();
const authentification = require("../middleware/authentification");

router.get("/reportCustomer", Controller.reportCustomer );
router.get("/reportAllPenjualan", Controller.reportAllPenjualan);
router.get("/reportSearchPenjualan", Controller.reportSearchPenjualan);
router.get("/reportPO", Controller.reportPO);
router.get("/reportSearchPO", Controller.reportSearchPO);

module.exports = router;
