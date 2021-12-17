const kelurahan = require('../model/kelurahanModel');
const sq = require("../config/connection");

class Controller {
  static register(req, res) {
    const { id, namaKelurahan, kecamatanId } = req.body;
    kelurahan.findAll({ where: { id: id, namaKelurahan: namaKelurahan } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "data sudah ada" });
      } else {
        kelurahan.create({ id, namaKelurahan, kecamatanId }).then((data2) => {
          res.status(200).json({ status: 200, message: "sukses" });
        }).catch((err) => {
          res.status(500).json({ status: 500, message: "gagal", data: err });
        });
      }
    })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static list(req, res) {
    kelurahan.findAll().then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    kelurahan.findAll({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static async listByKecamatanId(req, res) {
    const { kecamatanId } = req.params;
    let data = await sq.query(`select k.id as "idkelurahan",k."namaKelurahan", k2.id as "idKecamatan",k2."namaKecamatan" from kelurahan k 
    join kecamatan k2 on k."kecamatanId" =k2.id 
    where k."deletedAt" isnull and k2."deletedAt" isnull and k2.id='${kecamatanId}'
    order by k."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
  static update(req, res) {
    const { id, namaKelurahan, kecamatanId } = req.body;
    kelurahan
      .update({ namaKelurahan, kecamatanId }, { where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete(req, res) {
    const { id } = req.body
    kelurahan.destroy({ where: { id: id } }).then(data => {
      res.status(200).json({ status: 200, message: "sukses" })
    }).catch(err => {
      res.status(500).json({ status: 500, message: "gagal", data: err })
    })
  }
}

module.exports = Controller;