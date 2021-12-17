const masterPengiriman = require("../model/masterPengirimanModel");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
  static register(req, res) {
    const { jenisKendaraan, nomorPengiriman, namaPengirim, noTelpPengirim } =
      req.body;
    masterPengiriman
      .findAll({ where: { nomorPengiriman: nomorPengiriman } })
      .then((data) => {
        if (data.length) {
          res.status(200).json({ status: 200, message: "data sudah ada" });
        } else {
            masterPengiriman
            .create({
              id: uuid_v4(),
              jenisKendaraan,
              nomorPengiriman,
              namaPengirim,
              noTelpPengirim,
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
    masterPengiriman
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
    masterPengiriman
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

  static detailsByNomor(req, res) {
    const { nomorPengiriman } = req.params;
    masterPengiriman
      .findAll({ where: { nomorPengiriman } })
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
    const {
      id,
      jenisKendaraan,
      nomorPengiriman,
      namaPengirim,
      noTelpPengirim,
    } = req.body;
    masterPengiriman
      .update(
        {
            jenisKendaraan,
            nomorPengiriman,
            namaPengirim,
            noTelpPengirim,
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
    masterPengiriman
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
}

module.exports = Controller;
