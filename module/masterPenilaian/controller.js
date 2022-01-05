const masterPenilaian = require('./model');
const { v4: uuid_v4 } = require('uuid');
const sq = require("../../config/connection");

class Controller {
    static register(req, res) {
        const { penilaian, masterKategoriPenilaianId } = req.body;
        masterPenilaian.create({ id: uuid_v4(), penilaian, masterKategoriPenilaianId })
            .then(data => {
                res.status(200).json({ status: 200, message: "sukses" });
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    message: "gagal",
                    data: err
                })
            })
    }

    static async list(req, res) {
        let data = await sq.query(`
            select mp.id as "masterPenilaianId", mp.penilaian ,mp."masterKategoriPenilaianId" ,mkp."namaKategoriPenilaian" ,mp."createdAt" ,mp."updatedAt" ,mp."deletedAt" 
                from "masterPenilaian" mp 
                join "masterKategoriPenilaian" mkp on mkp.id = mp."masterKategoriPenilaianId" 
            where mp."deletedAt" isnull 
                and mkp."deletedAt" isnull `);
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
    }

    static detailsById(req, res) {
        const { id } = req.params;
        masterPenilaian.findAll({
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
        const { id, penilaian, masterKategoriPenilaianId } = req.body;
        masterPenilaian.update({
            penilaian, masterKategoriPenilaianId
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
        masterPenilaian.destroy({
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