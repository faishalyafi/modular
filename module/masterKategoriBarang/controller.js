const masterKategoriBarang = require("./model");
const { v4: uuid_v4 } = require("uuid");

class Controller {
  static register(req, res) {
    const { namaKategori } = req.body;
    masterKategoriBarang
      .findAll({
        where: {
          namaKategori,
        },
      })
      .then((data) => {
        if (data.length) {
          res
            .status(200)
            .json({ status: 200, message: "category sudah terdaftar" });
        } else {
          masterKategoriBarang
            .create(
              {
                id: uuid_v4(),
                namaKategori,
              },
              { returning: true }
            )
            .then((response) => {
              res
                .status(200)
                .json({ status: 200, message: "sukses", data: response });
            })
            .catch((err) => {
              res
                .status(500)
                .json({ status: 200, message: "gagal", data: err });
            });
        }
      });
  }
  static update(req, res) {
    const { id, namaKategori } = req.body;
    // masterKategoriBarang.findAll({ where: { namaKategori } }).then((data) => {
    //   if (data.length) {
    //     res.status(200).json({ status: 200, message: "Category sudah ada" });
    //   } else {
    masterKategoriBarang.update({ namaKategori }, { where: { id }, returning: true }).then((response) => {
        res.status(200).json({ status: 200, message: "sukses", data: response[1][0] });
      })
      .catch((err) => {
        res.status(200).json({ status: 200, message: "gagal", data: err });
      });
    // }
    // });
  }
  static delete(req, res) {
    const { id } = req.body;
    masterKategoriBarang
      .destroy({ where: { id: id } })
      .then((response) => {
        res.status(200).json({ status: 200, message: "sukses" });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal" });
      });
  }
  static list(req, res) {
    masterKategoriBarang
      .findAll()
      .then((response) => {
        res
          .status(200)
          .json({ status: 200, message: "sukses", data: response });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    masterKategoriBarang
      .findAll({ where: { id } })
      .then((response) => {
        res
          .status(200)
          .json({ status: 200, message: "sukses", data: response });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
}

module.exports = Controller;
