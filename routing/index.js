const router = require("express").Router();
const user = require("./user");
const log = require("./log");
const unit = require("./unit");
const customerCategory = require("./customerCategory");
const customer = require("./customer");
const masterKategoriBarang = require("./masterKategoriBarang");
const masterBarang = require("./masterBarang");
const masterSupplier = require("./masterSupplier");
const pic = require("./pic");
const bank = require("../module/masterBank/route");
const PO = require("./PO");
const OP = require("./OP");
const masterPengiriman = require("./masterPengiriman");
const gudang = require("./gudang");
const transaksiPO = require("./transaksiPO");
const transaksiOP = require("./transaksiOP");
const stock = require("./stock");
const report = require("./report");
const produksi = require("./produksi");
const subProduksi = require("./subProduksi");
const formula = require("./formula");
const salesMobile=require('./salesMobile');
const stockKeluar=require('./stockKeluar');
const kategoriHarga=require('./masterKategoriHarga');
const kelurahan=require('./kelurahan');
const kecamatan=require('./kecamatan');
const kota=require('./kota');
const provinsi=require('./provinsi');
const absensiSales=require('./absensiSales')
const masterDivisi=require('./masterDivisi')
const masterPosisi=require('./masterPosisi')
const loker=require('./loker')
const postLoker = require('./postLoker');
const kelengkapanLamaran = require('./kelengkapanLamaran');
const riwayatPendidikan = require('./riwayatPendidikan');
const pengalamanKerja = require('./pengalamanKerja');
const PR = require("./PR");
const masterTahapan = require("./masterTahapan");
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
