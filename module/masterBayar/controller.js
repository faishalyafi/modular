const masterBayar = require("./model");
const masterPiutang = require("../masterPiutang/model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
    static register(req, res) {
        const { masterPiutangId, jumlahBayar, tanggalBayar, masterUserId, masterBankId } = req.body;
        masterBayar.create({ id: uuid_v4(), masterPiutangId, jumlahBayar, tanggalBayar, masterUserId, masterBankId })
            .then((data2) => {
                masterPiutang.findAll({
                    where: {
                        id: masterPiutangId
                    }
                })
                .then((data3) => {
                    let sisa = data3[0].piutangAwal - jumlahBayar;
                    masterPiutang.update({
                        sisaPiutang: sisa
                    }, {
                        where: {
                            id: masterPiutangId
                        }
                    })
                    .then((data4) => {
                        res.status(200).json({ status: 200, message: "sukses" });
                    })
                })
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }

    static list(req, res) {
        masterBayar.findAll()
        .then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data });
        })
        .catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static detailsById(req, res) {
        const { id } = req.params;
        masterBayar.findAll({ where: { id } }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static update(req, res) {
        const { id, masterPiutangId, jumlahBayar, tanggalBayar, masterUserId, masterBankId } = req.body;
        masterBayar.update({ masterPiutangId, jumlahBayar, tanggalBayar, masterUserId, masterBankId }, { where: { id }, returning: true }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data[1] });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static delete(req, res) {
        const { id } = req.body;
        masterBayar.destroy({ where: { id: id } }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

}

module.exports = Controller;