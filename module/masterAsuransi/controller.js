const masterAsuransi = require("./model");
const { v4: uuid_v4 } = require("uuid");

class Controller {
  static register(req, res) {
    const { namaAsuransi } = req.body;
    masterAsuransi
      .findAll({
        where: { namaAsuransi },
      })
      .then((data) => {
        if (data.length) {
          res.status(200).json({
            status: 200,
            message: "data sudah ada",
          });
        } else {
          masterAsuransi
            .create({ id: uuid_v4(),namaAsuransi })
            .then((data) => {
              res.status(200).json({
                status: 200,
                message: "sukses",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static list(req, res) {
    masterAsuransi
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
    masterAsuransi
      .findAll({
        where: { id },
      })
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
    const { id, namaAsuransi } = req.body;
    masterAsuransi
      .update(
        { namaAsuransi },
        {
          where: { id }
        }
      )
      .then((data2) => {
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

  static delete(req, res) {
    const { id } = req.body;
    masterAsuransi
      .destroy({
        where: { id },
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
