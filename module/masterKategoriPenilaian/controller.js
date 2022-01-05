const masterKategoriPenilaian = require('./model');
const { v4: uuid_v4 } = require('uuid');
const sq = require("../../config/connection");

class Controller {
    static register(req, res) {
        const { namaKategoriPenilaian } = req.body;
        masterKategoriPenilaian.findAll({
            where: { namaKategoriPenilaian }
        })
            .then(data => {
                if (data.length) {
                    res.status(200).json({ status: 200, message: "data sudah ada" });
                } else {
                    masterKategoriPenilaian.create({ id: uuid_v4(), namaKategoriPenilaian })
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
        masterKategoriPenilaian.findAll()
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
        masterKategoriPenilaian.findAll({
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
        const { id, namaKategoriPenilaian } = req.body;
        masterKategoriPenilaian.update({
            namaKategoriPenilaian
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
        masterKategoriPenilaian.destroy({
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