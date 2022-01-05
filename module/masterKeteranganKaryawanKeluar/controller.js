const masterKeteranganKaryawanKeluar = require('./model');
const { v4: uuid_v4 } = require('uuid');
const sq = require("../../config/connection");

class Controller {
    static register(req, res) {
        const { keteranganKaryawanKeluar } = req.body;
        masterKeteranganKaryawanKeluar.findAll({
            where: { keteranganKaryawanKeluar }
        })
            .then(data => {
                if (data.length) {
                    res.status(200).json({ status: 200, message: "data sudah ada" });
                } else {
                    masterKeteranganKaryawanKeluar.create({ id: uuid_v4(), keteranganKaryawanKeluar })
                        .then(data => {
                            res.status(200).json({ status: 200, message: "sukses" });
                        })
                }
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    message: "gagal",
                    data: err
                })
            })
    }

    static list(req, res) {
        masterKeteranganKaryawanKeluar.findAll()
            .then(data => {
                res.status(200).json({
                    status: 200,
                    message: "sukses",
                    data: data
                });
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    message: "gagal",
                    data: err
                })
            })
    }

    static detailsById(req, res) {
        const { id } = req.params;
        masterKeteranganKaryawanKeluar.findAll({
            where: { id }
        })
            .then(data => {
                res.status(200).json({
                    status: 200,
                    message: "sukses",
                    data: data
                });
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    message: "gagal",
                    data: err
                })
            })
    }

    static update(req, res) {
        const { id, keteranganKaryawanKeluar } = req.body;
        masterKeteranganKaryawanKeluar.update({
            keteranganKaryawanKeluar
        }, {
            where: { id }
        })
            .then(data => {
                res.status(200).json({
                    status: 200,
                    message: "sukses"
                })
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    message: "gagal",
                    data: err
                })
            })
    }

    static delete(req, res) {
        const { id } = req.body
        masterKeteranganKaryawanKeluar.destroy({
            where: { id }
        })
            .then(data => {
                res.status(200).json({
                    status: 200,
                    message: "sukses"
                })
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    message: "gagal",
                    data: err
                })
            })
    }
}

module.exports = Controller;