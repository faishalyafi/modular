const pengalamanKerja = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
    static register(req, res) {
        const { kelengkapanLamaranId, bulkPengalamanKerja } = req.body;
        for (let i = 0; i < bulkPengalamanKerja.length; i++) {
            bulkPengalamanKerja[i].id = uuid_v4();
            bulkPengalamanKerja[i].kelengkapanLamaranId = kelengkapanLamaranId;
        }
        pengalamanKerja.bulkCreate(bulkPengalamanKerja)
            .then((data) => {
                res.status(200).json({ status: 200, message: "sukses", });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }

    static list(req, res) {
        pengalamanKerja.findAll()
            .then((data) => {
                res.status(200).json({ status: 200, message: "sukses", data: data });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }

    static detailsById(req, res) {
        const { pengalamanKerjaId } = req.params;
        pengalamanKerja.findAll({
            where: { id: pengalamanKerjaId }
        })
            .then((data) => {
                res.status(200).json({ status: 200, message: "sukses", data: data });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }

    static update(req, res) {
        const {kelengkapanLamaranId,bulkPengalamanKerja } = req.body;
        riwayatPendidikan.destroy({ where: { kelengkapanLamaranId: kelengkapanLamaranId } }).then((data) => {
          for (let i = 0; i < bulkPengalamanKerja.length; i++) {
            const idPengalamanKerja = uuid_v4();
            bulkPengalamanKerja[i].kelengkapanLamaranId = kelengkapanLamaranId;
            bulkPengalamanKerja[i].id = idPengalamanKerja;
          }
          riwayatPendidikan.bulkCreate(bulkPengalamanKerja).then((data2) => {
            res.status(200).json({ status: 200, message: "sukses", data: data2 });
          }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
          });
        })
      }

    static delete(req, res) {
        const { pengalamanKerjaId } = req.body;
        pengalamanKerja.destroy({ where: { id: pengalamanKerjaId } })
            .then((data) => {
                res.status(200).json({ status: 200, message: "sukses" });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }
}

module.exports = Controller;