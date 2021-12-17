const masterBarang = require("../model/masterBarangModel");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
  static register(req, res) {
    const {kodeBarang,namaBarang,barcode,masterKategoriBarangId,masterUnitId} = req.body;
    const id = uuid_v4();
    let foto = "";
    if (req.files.file1) {
      if (req.files.file1[0]) {
        foto = req.files.file1[0].filename;
      }
    }
    masterBarang
      .create({id,kodeBarang,namaBarang,barcode,foto,masterKategoriBarangId,masterUnitId})
      .then((respon) => {
        res.status(200).json({ status: 200, message: "sukses", data: respon });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static update(req, res) {
    const {id,kodeBarang,namaBarang,barcode,masterKategoriBarangId,masterUnitId} = req.body;
    if (req.files.file1) {
      if (req.files.file1[0]) {
        const foto = req.files.file1[0].filename;
        masterBarang.update({ foto }, { where: { id: id } });
      }
    }
    masterBarang
      .update({kodeBarang,namaBarang,barcode,masterKategoriBarangId,masterUnitId},{ where: { id: id }, returning: true })
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1][0] });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete(req, res) {
    const { id } = req.body;
    masterBarang.destroy({ where: { id } })
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses" });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal",data:err });
      });
  }
  static async list(req, res) {
    // let data = await sq.query(`select mb.id as "masterBarangId", * , (select sum(s."jumlahStock") as "jumlahStock" from stock s where s."masterBarangId" = mb.id group by s."masterBarangId") from "masterBarang" mb join "masterKategoriBarang" mkb on mb."masterKategoriBarangId" = mkb.id join "masterUnit" mu on mb."masterUnitId" = mu.id where mb."deletedAt" isnull and mkb."deletedAt" isnull and mu."deletedAt" isnull `);
    let data = await sq.query(`select mb.id as "masterBarangId",* from "masterBarang" mb join "masterKategoriBarang" mkb on mkb.id = mb."masterKategoriBarangId" join "masterUnit" mu on mu.id = mb."masterUnitId" where mb."deletedAt" isnull and mu."deletedAt" isnull and mkb."deletedAt" isnull `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async detailsById(req, res) {
    const { id } = req.params;
    let data =
      await sq.query(`select mb.id as "masterBarangId", * , (select sum(s."jumlahStock") as "jumlahStock" from stock s where s."masterBarangId" = mb.id group by s."masterBarangId")
      from "masterBarang" mb join "masterKategoriBarang" mkb on mb."masterKategoriBarangId" = mkb.id join "masterUnit" mu on mb."masterUnitId" = mu.id where mb."deletedAt" isnull and mkb."deletedAt" isnull and mu."deletedAt" isnull and mb.id = '${id}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listKodeBarang(req, res) {
    let data = await sq.query(`select mb."kodeBarang" from "masterBarang" mb where mb."deletedAt" isnull `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listBarangByKategoriId(req, res) {
    const { masterKategoriId } = req.body;
    let data = await sq.query(`select mb.id as "masterBarangId",* from "masterBarang" mb join "masterKategoriBarang" mkb on mb ."masterKategoriBarangId" = mkb.id where mb."deletedAt" isnull and mkb."deletedAt" isnull and mkb.id  = '${masterKategoriId}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listAllStockBarang(req,res){
    // let data = await sq.query(`select *,(select sum(so."jumlahBarangSubOP") as "jumlahOrderSubOP" from "subOP" so where so."deletedAt" isnull and so."masterBarangId"=mb.id group by so."masterBarangId") from "masterBarang" mb where mb."deletedAt" isnull order by mb."createdAt" `);
    // for (let i = 0; i < data[0].length; i++) {
    //   data[0][i].jumlahStockBarangSales = data[0][i].jumlahTotalBarang - data[0][i].jumlahOrderSubOP;
    // }
    // res.status(200).json({status:200,message:"sukses",data:data[0]})
    masterBarang.findAll({raw:true}).then((data)=>{
      res.status(200).json({status:200,message:"sukses",data:data});
    }).catch((err)=>{
      res.status(500).json({status:500,message:"gagal",data:err});
    });
  }

  static async detailStockBarang(req,res){
    const {idBarang} = req.params;
    let data = await sq.query(`select mb.id,mb."namaBarang" ,mb.barcode ,mb.foto ,mb."createdAt" ,mb."updatedAt" ,mb."masterKategoriBarangId" ,mkb."namaKategori" ,mb."masterUnitId" ,mu.satuan ,mu."jumlahIsi" ,mb."kodeBarang",mb."jumlahTotalBarang" from "masterBarang" mb join "masterKategoriBarang" mkb on mb."masterKategoriBarangId" = mkb.id join "masterUnit" mu on mu.id = mb."masterUnitId" where mb."deletedAt" isnull and mb.id = '${idBarang}' order by mb."createdAt" `);
    // for (let i = 0; i < data[0].length; i++) {
    //   data[0][i].jumlahStockBarangSales = data[0][i].jumlahTotalBarang - data[0][i].jumlahOrderSubOP;
    // (select sum(so."jumlahBarangSubOP") as "jumlahOrderSubOP" from "subOP" so where so."deletedAt" isnull and so."masterBarangId"=mb.id group by so."masterBarangId")
    // }
    res.status(200).json({status:200,message:"sukses",data:data[0]})
  }
}
module.exports = Controller;
