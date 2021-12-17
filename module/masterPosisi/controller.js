const masterPosisi = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
    static register(req, res) {
        const { namaPosisi, kodePosisi, masterDivisiId } = req.body;
        masterPosisi.findAll({ where: { namaPosisi } }).then((data) => {
            if (data.length) {
                res.status(200).json({ status: 200, message: "data sudah ada" });
            } else {
                masterPosisi.create({ id: uuid_v4(), namaPosisi, kodePosisi, masterDivisiId }).then((data2) => {
                    res.status(200).json({ status: 200, message: "sukses" });
                });
            }
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static async list(req, res) {
        let data = await sq.query(`
            select mp.id as "masterPosisiId", mp."namaPosisi" ,mp."kodePosisi" ,mp."masterDivisiId" ,md."namaDivisi" ,mp."createdAt" ,mp."updatedAt" ,mp."deletedAt" 
            from "masterPosisi" mp 
            join "masterDivisi" md on md.id = mp."masterDivisiId" 
            where mp."deletedAt" isnull 
            and md."deletedAt" isnull `);
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
    }

    static detailsById(req, res) {
        const { id } = req.params;
        masterPosisi.findAll({ where: { id: id } }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static update(req, res) {
        const { id, namaPosisi, kodePosisi, masterDivisiId } = req.body;
        masterPosisi.update({ namaPosisi, kodePosisi, masterDivisiId }, { where: { id }, returning: true }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data: data[1] });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static delete(req, res) {
        const { id } = req.body;
        masterPosisi.destroy({ where: { id: id } }).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", });
        }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

}

module.exports = Controller;