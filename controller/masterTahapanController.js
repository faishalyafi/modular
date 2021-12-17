const tahapan = require('../model/masterTahapanModel');
const sq = require("../config/connection");
const { v4: uuid_v4 } = require("uuid");

class Controller {
  static register(req, res) {
    const { namaTahapan } = req.body;
    tahapan.findAll({ where: { namaTahapan: namaTahapan } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "data sudah ada" });
      } else {
        tahapan.create({ id:uuid_v4(), namaTahapan }).then((data2) => {
          res.status(200).json({ status: 200, message: "sukses" });
        }).catch((err) => {
          console.log("tahapan error");
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
      }
    })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static list(req, res) {
    tahapan.findAll().then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    tahapan.findAll({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static update(req, res) {
    const { id, namaTahapan } = req.body;
    tahapan
      .update({ namaTahapan }, { where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete(req, res) {
    const { id } = req.body
    tahapan.destroy({ where: { id: id } }).then(data => {
      res.status(200).json({ status: 200, message: "sukses" })
    }).catch(err => {
      res.status(500).json({ status: 500, message: "gagal", data: err })
    })
  }
}

module.exports = Controller;