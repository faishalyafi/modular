const gudang = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
  static register(req, res) {
    const { kodeGudang, namaGudang } = req.body;
    gudang
      .findAll({ where: { kodeGudang: kodeGudang } })
      .then((data) => {
        if (data.length) {
          res.status(200).json({ status: 200, message: "kodeGudang sudah ada" });
        } else {
            gudang
            .create({
              id: uuid_v4(),
              kodeGudang,
              namaGudang,
            })
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
    gudang
      .findAll()
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static detailsById(req, res) {
    const { id } = req.params;
    gudang
      .findAll({ where: { id: id } })
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static update(req, res) {
    const {id, kodeGudang, namaGudang } = req.body;
    gudang
      .update(
        {
          kodeGudang,
          namaGudang,
        },
        { where: { id }, returning: true }
      )
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static delete(req, res) {
    const { id } = req.body;
    gudang
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static listBarangByGudangId(req, res) {}
}

module.exports = Controller;
