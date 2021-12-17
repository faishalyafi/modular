const router = require("express").Router();
<<<<<<< HEAD
const user = require("../module/masterUser/route");
const log = require("../module/log/route");
const unit = require("../module/masterUnit/route");
const customerCategory = require("../module/masterKategoriCustomer/route");
const customer = require("../module/masterCustomer/route");
const masterKategoriBarang = require("../module/masterKategoriBarang/route");
=======
const user = require("../module/user/route");
const log = require("./log");
const unit = require("./unit");
const customerCategory = require("./customerCategory");
const customer = require("./customer");
const masterKategoriBarang = require("./masterKategoriBarang");
>>>>>>> c18e09ce7879a1c5ed657d0ceb77d799163e8261
const masterBarang = require("../module/masterBarang/route");
const masterSupplier = require("../module/masterSupplier/route");
const pic = require("../module/masterPic/route");
const bank = require("../module/masterBank/route");
const PO = require("../module/PO/route");
const OP = require("../module/OP/route");
const masterPengiriman = require("./masterPengiriman");
const gudang = require("../module/gudang/route");
const transaksiPO = require("../module/transaksiPO/route");
const transaksiOP = require("./transaksiOP");
const stock = require("../module/stock/route");
const report = require("./report");
const produksi = require("../module/produksi/produksi");
const subProduksi = require("../module/subProduksi/route");
const formula = require("../module/formula/route");
const salesMobile=require('../module/salesMobile/route');
const stockKeluar=require('../module/stockKeluar/route');
const kategoriHarga=require('../module/masterKategoriHarga/route');
const kelurahan=require('../module/kelurahan/route');
const kecamatan=require('../module/kecamatan/route');
const kota=require('../module/kota/route');
const provinsi=require('../module/provinsi/route');
const absensiSales=require('./absensiSales')
const masterDivisi=require('./masterDivisi')
const masterPosisi=require('../module/masterPosisi/route')
const loker=require('../module/loker/route')
const postLoker = require('../module/postLoker/route');
const kelengkapanLamaran = require('../module/kelengkapanLamaran/route');
const riwayatPendidikan = require('../module/riwayatPendidikan/route');
const pengalamanKerja = require('../module/pengalamanKerja/route');
const PR = require("../module/PR/route");
const masterTahapan = require("../module/masterTahapan/route");
const poolTahapan = require("../module/poolTahapan/route");
const masterPiutang = require("../module/masterPiutang/route");


router.use("/user", user);
router.use("/log", log);
router.use("/unit", unit);
router.use("/kategoriCustomer", customerCategory);
router.use("/customer", customer); 
router.use("/masterBarang", masterBarang);
router.use("/masterKategoriBarang", masterKategoriBarang);
router.use("/masterSupplier", masterSupplier);
router.use("/pic", pic);
router.use("/PO", PO);
router.use("/PR", PR);
router.use("/OP", OP);
router.use("/bank", bank); 
router.use("/masterPengiriman", masterPengiriman);
router.use("/gudang", gudang);
router.use("/stock", stock);
router.use("/transaksiPO", transaksiPO);
router.use("/transaksiOP", transaksiOP);
router.use("/formula", formula);
router.use("/report", report);
router.use("/produksi", produksi);
router.use("/subProduksi", subProduksi);
router.use('/salesMobile',salesMobile);
router.use('/stockKeluar',stockKeluar);
router.use('/kategoriHarga',kategoriHarga);
router.use('/kelurahan',kelurahan);
router.use('/kecamatan',kecamatan);
router.use('/kota',kota);
router.use('/provinsi',provinsi);
router.use('/absensiSales',absensiSales)
router.use('/masterDivisi',masterDivisi)
router.use('/masterPosisi',masterPosisi)
router.use('/loker',loker)
router.use('/postLoker', postLoker);
router.use('/kelengkapanLamaran', kelengkapanLamaran);
router.use('/riwayatPendidikan', riwayatPendidikan);
router.use('/pengalamanKerja', pengalamanKerja);
router.use('/masterTahapan', masterTahapan);
router.use('/poolTahapan', poolTahapan);
router.use('/masterPiutang', masterPiutang);



module.exports = router;
