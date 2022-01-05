const masterCuti = require('./model');
const sq = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");

class Controller {
  static register(req, res) {
    const { namaCuti } = req.body;
    masterCuti.findAll({ where: { namaCuti: namaCuti } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "data sudah ada" });
      } else {
        masterCuti.create({ id: uuid_v4(), namaCuti }).then((data1) => {
          res.status(200).json({ status: 200, message: "sukses" });
        })
      }
    })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static list(req, res) {
    masterCuti.findAll().then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    masterCuti.findAll({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static update(req, res) {
    const { id, namaCuti } = req.body;
    masterCuti.update({ namaCuti }, { where: { id }, returning: true }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data[1] });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static delete(req, res) {
    const { id } = req.body
    masterCuti.destroy({ where: { id: id } }).then(data => {
      res.status(200).json({ status: 200, message: "sukses" })
    }).catch(err => {
      res.status(500).json({ status: 500, message: "gagal", data: err })
    })
  }
}

module.exports = Controller;