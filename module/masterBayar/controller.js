const masterBayar = require("../model/masterBayarModel");
const masterPiutang = require("../model/masterPiutangModel");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
    static register(req, res) {
        const { masterPiutangId, jumlahBayar, tanggalBayar, masterUserId, masterBankId, metodePelunasan } = req.body;
        if (!masterUserId) {
            masterUserId = req.dataUsers.id;
        }
        let f1 = "";
        if (req.files) {
            if (req.files.file1) {
                f1 = req.files.file1[0].filename;
            }
        }
        masterBayar.create({ id: uuid_v4(), masterPiutangId, jumlahBayar, tanggalBayar, masterUserId, masterBankId, metodePelunasan, buktiPembayaran: f1 })
            .then((data2) => {
                masterPiutang.findAll({
                    where: {
                        id: masterPiutangId
                    }
                })
                    .then(async (data3) => {
                        let sisa = 0;
                        let statusPiutang;
                        for (let i = 0; i < data3.length; i++) {
                            sisa = data3[i].sisaPiutang - jumlahBayar;
                        }
                        if (sisa > 0) {
                            statusPiutang = 1
                        } else {
                            statusPiutang = 2
                        }
                        let data = await sq.query(`
                            update "masterPiutang" 
                            set "statusPiutang" = ${statusPiutang} ,"sisaPiutang" = ${sisa}
                            where id = '${masterPiutangId}'`);
                        res.status(200).json({ status: 200, message: "sukses" });
                    })
                    .catch((err) => {
                        res.status(500).json({ status: 500, message: "gagal", data: err });
                    });
            })
    }

    static async list(req, res) {
        let data = await sq.query(`
        select mb.id as "masterBayarId",mb."jumlahBayar",mb."tanggalBayar",mb."masterPiutangId",mb."masterUserId",mb."masterBankId",mp."OPId" ,o."nomorOP",mb2."namaBank" ,mb."metodePelunasan",mb."buktiPembayaran" , mb."createdAt",mb."updatedAt" ,mb."deletedAt" 
        from "masterPiutang" mp 
        join "OP" o on o.id = mp."OPId" 
        join "masterBayar" mb on mb."masterPiutangId" = mp.id 
        join "masterBank" mb2 on mb2.id = mb."masterBankId" 
        where mp."deletedAt" isnull 
        and o."deletedAt" isnull 
        and mb."deletedAt" isnull
        and mb2."deletedAt" isnull `);
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
    }

    static async listBayarByMasterPiutangId(req, res) {
        const { masterPiutangId } = req.params;
        let data = await sq.query(`
        select mb.id as "masterBayarId",mb."jumlahBayar",mb."tanggalBayar",mb."masterPiutangId",mb."masterUserId",mb."masterBankId",mp."OPId" ,o."nomorOP",mb2."namaBank" ,mb."metodePelunasan",mb."buktiPembayaran" , mb."createdAt",mb."updatedAt" ,mb."deletedAt" 
        from "masterPiutang" mp 
        join "OP" o on o.id = mp."OPId" 
        join "masterBayar" mb on mb."masterPiutangId" = mp.id 
        join "masterBank" mb2 on mb2.id = mb."masterBankId" 
        where mp."deletedAt" isnull 
        and o."deletedAt" isnull 
        and mb."deletedAt" isnull 
        and mb2."deletedAt" isnull 
        and mb."masterPiutangId" = '${masterPiutangId}'`);
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
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