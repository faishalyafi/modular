const masterPiutang = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
    static register(req, res) {
        const { piutangAwal, sisaPiutang, TOPPiutang, statusPiutang, OPId } = req.body;
        masterPiutang.create({ id: uuid_v4(), piutangAwal, sisaPiutang, TOPPiutang, statusPiutang, OPId })
            .then((data2) => {
                res.status(200).json({ status: 200, message: "sukses" });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }

    static list(req, res) {
        masterPiutang.findAll()
        .then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data });
        })
        .catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static detailsById(req, res) {
        const { id } = req.params;
        masterPiutang.findAll({ where: { id } }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static update(req, res) {
        const { id, piutangAwal, sisaPiutang, TOPPiutang, statusPiutang, OPId } = req.body;
        masterPiutang.update({ piutangAwal, sisaPiutang, TOPPiutang, statusPiutang, OPId }, { where: { id }, returning: true }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data[1] });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static delete(req, res) {
        const { id } = req.body;
        masterPiutang.destroy({ where: { id: id } }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

}

module.exports = Controller;