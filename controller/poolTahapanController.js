const poolTahapan = require("../model/poolTahapanModel");
const postLoker=require("../model/postLokerModel")
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
  static register(req, res) {
    const { nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,masterTahapanId,postLokerId} = req.body;
    poolTahapan.findAll({ where: { postLokerId: postLokerId } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "data sudah ada" });
      } else {
        poolTahapan.create({ id: uuid_v4(), nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,masterTahapanId,postLokerId }).then((data1) => {
          res.status(200).json({ status: 200, message: "sukses" });
        });
      }
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static list(req, res) {
      poolTahapan.findAll().then((data) => {
          res.status(200).json({status: 200,message: "sukses",data: data});
        }).catch((err) => {
          res.status(500).json({status: 500, message: "gagal",data: err});
        });
    }


  static detailsById(req, res) {
    const { id } = req.params;
    poolTahapan.findAll({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static update(req, res) {
    const { id, nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,statusTahapan,masterTahapanId,postLokerId } = req.body;
    poolTahapan.update({ nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,statusTahapan,masterTahapanId,postLokerId }, { where: { id }, returning: true }).then((data) => {
      if(req.body.statusTahapan == 2){
        postLoker.update({statusPostLoker : 2}, { where: { id:postLokerId }, returning: true }).then((data1) => {
          res.status(200).json({ status: 200, message: "sukses", data: data[1] })
        }).catch((err) => {
          console.log("if error");
          res.status(500).json({ status: 500, message: "gagal", data: err });
        });
      }else{
        res.status(200).json({ status: 200, message: "sukses", data: data[1] })
      }
    }).catch((err) => {
      console.log("error");
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static delete(req, res) {
    const { id } = req.body;
    poolTahapan.destroy({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

}

module.exports = Controller;