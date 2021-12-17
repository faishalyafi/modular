const loker = require("../model/lokerModel");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
  static register(req, res) {
    const { namaLoker, keteranganLoker, tanggalAkhirLoker, masterPosisiId } = req.body;
    loker.findAll({ where: { namaLoker: namaLoker } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "data sudah ada" });
      } else {
        loker.create({ id: uuid_v4(), namaLoker, keteranganLoker, tanggalAkhirLoker, masterPosisiId }).then((data) => {
          res.status(200).json({ status: 200, message: "sukses" });
        });
      }
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  // static list(req, res) {
  //     loker.findAll().then((data) => {
  //         res.status(200).json({status: 200,message: "sukses",data: data});
  //       }).catch((err) => {
  //         res.status(500).json({status: 500, message: "gagal",data: err});
  //       });
  //   }

  static async list(req, res) {
    let data = await sq.query(`
      select l.id as "lokerId", l."namaLoker" ,l."keteranganLoker" ,l."tanggalAkhirLoker" ,l."masterPosisiId" ,mp."namaPosisi" ,l."createdAt" ,l."updatedAt" ,l."deletedAt" 
      from loker l 
      join "masterPosisi" mp ON mp.id = l."masterPosisiId" 
      where l."deletedAt" isnull 
      and mp."deletedAt" isnull `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static detailsById(req, res) {
    const { id } = req.params;
    loker.findAll({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static update(req, res) {
    const { id, namaLoker, keteranganLoker, tanggalAkhirLoker, masterPosisiId } = req.body;
    loker.update({ namaLoker, keteranganLoker, tanggalAkhirLoker, masterPosisiId }, { where: { id }, returning: true }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data[1] });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static delete(req, res) {
    const { id } = req.body;
    loker.destroy({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static async searchLoker(req, res) {
    const { masterPosisiId } = req.body;
    let data = await sq.query(`
      select l.id as "lokerId",l."namaLoker" ,l."keteranganLoker" ,l."tanggalAkhirLoker" ,l."masterPosisiId" ,mp."namaPosisi" ,mp."kodePosisi" ,l."createdAt" ,l."updatedAt" ,l."deletedAt" 
      from loker l 
      join "masterPosisi" mp on mp.id = l."masterPosisiId" 
      where "masterPosisiId" = '${masterPosisiId}' 
      and l."deletedAt" isnull 
      and mp."deletedAt" isnull `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

}

module.exports = Controller;