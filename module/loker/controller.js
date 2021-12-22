const loker = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const kebutuhanLoker=require("../kebutuhanLoker/model")

class Controller {
  static register(req, res) {
    const { namaLoker, keteranganLoker, tanggalAkhirLoker, masterPosisiId,bulkKebutuhan} = req.body;
    const idLoker=uuid_v4()
    loker.findAll({ where: { namaLoker: namaLoker } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "data sudah ada" });
      } else {
        loker.create({ id: idLoker, namaLoker, keteranganLoker, tanggalAkhirLoker, masterPosisiId }).then((data1) => {
          for (let i = 0; i < bulkKebutuhan.length; i++) {
            bulkKebutuhan[i].id = uuid_v4();
            bulkKebutuhan[i].lokerId = idLoker;
          }
          kebutuhanLoker.bulkCreate(bulkKebutuhan).then((data2) => {
          res.status(200).json({ status: 200, message: "sukses" });
        });
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
  static async listByKebutuhanLokerId(req, res) {
    const {id}=req.params
    let data = await sq.query(`select l.id as "idLoker", l."namaLoker" ,mk.id  as "masterKebutuhanId" ,mk."namaKebutuhan" from "kebutuhanLoker" kl join loker l on kl."lokerId" =l.id join "masterKebutuhan" mk on kl."masterKebutuhanId" =mk.id where kl."deletedAt" isnull and l."deletedAt" isnull and mk ."deletedAt" isnull  and l.id ='${id}' `);
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
    const { id, namaLoker, keteranganLoker, tanggalAkhirLoker, masterPosisiId,bulkKebutuhan} = req.body;
    loker.update({ namaLoker, keteranganLoker, tanggalAkhirLoker, masterPosisiId }, { where: { id }, returning: true }).then((data) => {
      kebutuhanLoker.destroy({ where: { lokerId: id } }).then((data) => {
        for (let i = 0; i < bulkKebutuhan.length; i++) {
          bulkKebutuhan[i].id = uuid_v4();
          bulkKebutuhan[i].lokerId = id;
        }
        kebutuhanLoker.bulkCreate(bulkKebutuhan).then((data2) => {
      res.status(200).json({ status: 200, message: "sukses", data: data[1] });
    })
  })
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static delete(req, res) {
    const { id } = req.body;
    loker.destroy({ where: { id: id } }).then((data) => {
      kebutuhanLoker.destroy({ where: { lokerId: id } }).then((data2) => {
      res.status(200).json({ status: 200, message: "sukses", });
    })
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