const poolKontrak = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const moment = require("moment");

class Controller {
    static register(req, res) {
        const { tanggalKontrak, masaBerlakuKontrak, dataKaryawanId } = req.body;
        let jatuhTempo = moment(tanggalKontrak).add(masaBerlakuKontrak, 'month').calendar();
        poolKontrak.findAll({ where: { dataKaryawanId }, order: [['createdAt', 'desc']] })
            .then((data) => {
                if (data.length == 0) {
                    poolKontrak.create({ id: uuid_v4(), tanggalKontrak, totalKontrak: 1, masaBerlakuKontrak, jatuhTempoKontrak: jatuhTempo, dataKaryawanId }).then((data) => {
                        res.status(200).json({ status: 200, message: "sukses" });
                    }).catch((err) => {
                        res.status(500).json({ status: 500, message: "gagal", data: err });
                    });
                } else {
                    poolKontrak.create({ id: uuid_v4(), tanggalKontrak, totalKontrak: data[0].totalKontrak + 1, masaBerlakuKontrak, jatuhTempoKontrak: jatuhTempo, dataKaryawanId }).then((data2) => {
                        res.status(200).json({ status: 200, message: "sukses" });
                    }).catch((err) => {
                        res.status(500).json({ status: 500, message: "gagal", data: err });
                    });
                }
            }).catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }

    static list(req, res) {
        poolKontrak.findAll().then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static detailsById(req, res) {
        const { id } = req.params;
        poolKontrak.findAll({ where: { id } }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static update(req, res) {
        const { id, tanggalKontrak, totalKontrak, masaBerlakuKontrak, jatuhTempoKontrak, dataKaryawanId } = req.body;
        poolKontrak.update({ tanggalKontrak, totalKontrak, masaBerlakuKontrak, jatuhTempoKontrak, dataKaryawanId }, { where: { id }, returning: true }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data[1] })
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static delete(req, res) {
        const { id } = req.body;
        poolKontrak.destroy({ where: { id } }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }
}

module.exports = Controller;