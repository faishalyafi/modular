const masterShift = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
  
  static register(req,res){
    const { jamAwal, jamAkhir,namaShift} = req.body;
  masterShift.findAll({ where: {namaShift:namaShift } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "data sudah ada" });
      } else {
          masterShift.create({id: uuid_v4(), jamAwal, jamAkhir,namaShift})
          .then((data) => {
            res.status(200).json({ status: 200, message: "sukses" });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static list(req, res) {
      masterShift.findAll().then((data) => {
          res.status(200).json({status: 200,message: "sukses",data: data});
        }).catch((err) => {
          res.status(500).json({status: 500, message: "gagal",data: err});
        });
    }

  static detailsById(req, res) {
    const { id } = req.params;
    masterShift.findAll({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static update(req, res) {
    const { id, jamAwal, jamAkhir,namaShift} = req.body;
    masterShift.update({ jamAwal, jamAkhir,namaShift}, { where: { id }, returning: true }).then((data) => {
        console.log(data);
        res.status(200).json({ status: 200, message: "sukses" , data:data[1]});
    }).catch((err) => {
      console.log("error");
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static delete(req, res) {
    const { id } = req.body;
    masterShift.destroy({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  

}

module.exports = Controller;