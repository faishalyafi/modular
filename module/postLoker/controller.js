const postLoker = require("../model/postLokerModel");
const kebutuhanLoker = require("../model/kebutuhanLokerModel");
const kebutuhanPelamar = require("../model/kebutuhanPelamarModel");
const kirimEmail = require("../helper/kirimEmail");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
    static register(req, res) {
        const { namaPengirim, emailPengirim, alamatPengirim, statusPostLoker, lokerId } = req.body;
        let fileCV = "";
        if (req.files) {
            if (req.files.file1) {
                fileCV = req.files.file1[0].filename
            }
        }
        kebutuhanLoker.findAll({
            where: { lokerId }
        })
            .then((data) => {
                postLoker
                    .create({ id: uuid_v4(), namaPengirim, emailPengirim, alamatPengirim, statusPostLoker, lokerId, CV: fileCV })
                    .then((data1) => {
                        kirimEmail.kirim(data1.emailPengirim);
                        let bulkKebutuhanPelamar = [];
                        for (let i = 0; i < data.length; i++) {
                            bulkKebutuhanPelamar.push({
                                id: uuid_v4(),
                                postLokerId: data1.id,
                                masterKebutuhanId: data[i].masterKebutuhanId,
                                statusKebutuhan: 0
                            })
                        }
                        kebutuhanPelamar.bulkCreate(bulkKebutuhanPelamar)
                            .then((data2) => {
                                res.status(200).json({ status: 200, message: "sukses", });
                            })
                            .catch((err) => {
                                res.status(500).json({ status: 500, message: "gagal", data: err });
                            });
                    })
            })
    }

    static async list(req, res) {
        let data = await sq.query(`
        select pl.id as "postLokerId",pl."namaPengirim" ,pl."emailPengirim" ,pl."alamatPengirim" ,pl."statusPostLoker" ,pl."lokerId" ,l."namaLoker" ,l."masterPosisiId" ,mp."namaPosisi" ,pl."CV", pl."createdAt" ,pl."updatedAt" ,pl."deletedAt" 
        from "postLoker" pl 
        join loker l on l.id = pl."lokerId" 
        join "masterPosisi" mp on mp.id = l."masterPosisiId" 
        where pl."deletedAt" isnull 
        and l."deletedAt" isnull 
        and mp."deletedAt" isnull `);
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
    }

    static async listByStatus(req, res) {
        let { statusPostLoker } = req.params;
        let data = await sq.query(`
            select distinct pl.id as "postLokerId", pl."namaPengirim" ,pl."emailPengirim" ,pl."alamatPengirim" ,pl."statusPostLoker" ,pl."CV" ,pl."lokerId" ,l."namaLoker" ,l."keteranganLoker" ,l."tanggalAkhirLoker" ,l."masterPosisiId" ,mp."namaPosisi" ,mp."kodePosisi" ,kl.id as "kelengkapanLamaranId",kl."statusKelengkapan" 
            from "postLoker" pl 
            join loker l on l.id = pl."lokerId" 
            join "masterPosisi" mp on mp.id = l."masterPosisiId" 
            left join "kelengkapanLamaran" kl on kl."postLokerId" = pl.id 
            where "statusPostLoker" = ${statusPostLoker}
            and pl."deletedAt" isnull 
            and l."deletedAt" isnull 
            and mp."deletedAt" isnull 
            and kl."deletedAt" isnull  `);
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
    }

    static async detailListByStatus(req, res) {
        let { postLokerId } = req.params;
        let data = await sq.query(`
        select distinct pl.id as "postLokerId", pl."namaPengirim" ,pl."emailPengirim" ,pl."alamatPengirim" ,pl."statusPostLoker" ,pl."CV" ,pl."lokerId" ,l."namaLoker" ,l."keteranganLoker" ,l."tanggalAkhirLoker" ,l."masterPosisiId" ,mp."namaPosisi" ,mp."kodePosisi" ,kl.id as "kelengkapanLamaranId",kl."statusKelengkapan",kl."namaPelamar" ,kl."nomorKTPPelamar" ,kl."posisiLamaran" ,kl."tinggiBadanPelamar" ,kl."beratBadanPelamar" ,kl."agamaPelamar" ,kl."kebangsaanPelamar" ,kl."jenisKelaminPelamar" ,kl."statusPelamar" ,kl."tempatLahirPelamar" ,kl."tanggalLahirPelamar" ,kl."noHpPelamar" ,kl."emailPelamar" ,kl."alamatPelamar" ,kl."tanggalMasukLamaran" 
            from "postLoker" pl 
            join loker l on l.id = pl."lokerId" 
            join "masterPosisi" mp on mp.id = l."masterPosisiId" 
            left join "kelengkapanLamaran" kl on kl."postLokerId" = pl.id 
            where pl."deletedAt" isnull 
            and l."deletedAt" isnull 
            and mp."deletedAt" isnull 
            and kl."deletedAt" isnull 
            and pl.id = '${postLokerId}' `);

        let rP = await sq.query(`
        select * 
        from "riwayatPendidikan" rp 
        where rp."kelengkapanLamaranId" = '${data[0][0].kelengkapanLamaranId}' 
        and rp."deletedAt" isnull `);

        let pK = await sq.query(`
        select * 
        from "pengalamanKerja" pk 
        where pk."kelengkapanLamaranId" = '${data[0][0].kelengkapanLamaranId}' 
        and pk."deletedAt" isnull `);

        let kP = await sq.query(`
        select kp.id as "kebutuhanPelamarId", kp."masterKebutuhanId" ,kp."fileKebutuhan" ,mk."namaKebutuhan" ,kp."statusKebutuhan" ,kp."postLokerId" 
        from "kebutuhanPelamar" kp 
        join "masterKebutuhan" mk on mk.id = kp."masterKebutuhanId" 
        where kp."deletedAt" isnull 
        and mk."deletedAt" isnull 
        and kp."postLokerId" = '${postLokerId}'`);

        data[0][0].riwayatPendidikan = rP[0];
        data[0][0].pengalamanKerja = pK[0];
        data[0][0].kebutuhanPelamar = kP[0];

        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
    }

    static detailsById(req, res) {
        const { id } = req.params;
        postLoker.findAll({ where: { id: id } })
            .then((data) => {
                res.status(200).json({ status: 200, message: "sukses", data: data });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }

    static async update(req, res) {
        const { id, namaPengirim, emailPengirim, alamatPengirim, statusPostLoker, lokerId } = req.body;
        if (req.files) {
            if (req.files.file1) {
                await sq.query(`update "postLoker" set "CV"='${req.files.file1[0].filename}' where id = '${id}'`);
            }
        }
        postLoker.update({ namaPengirim, emailPengirim, alamatPengirim, statusPostLoker, lokerId },
            {
                where: { id: id }
            })
            .then((data) => {
                res.status(200).json({ status: 200, message: "sukses" });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
    }

    static delete(req, res) {
        const { id } = req.body;
        postLoker.destroy({ where: { id } }).then((data) => {
            kebutuhanPelamar.destroy({ where: { postLokerId: id } })
                .then((data2) => {
                    res.status(200).json({ status: 200, message: "sukses" });
                })
                .catch((err) => {
                    res.status(500).json({ status: 500, message: "gagal", data: err });
                });
        })
    }

    static async jumlahPelamarByLoker(req, res) {
        let data = await sq.query(`
            select pl."lokerId",l."namaLoker", count(*) as "jumlahPelamar" 
            from "postLoker" pl 
            join loker l on l.id = pl."lokerId" 
            where pl."deletedAt" isnull 
            and l."deletedAt" isnull 
            group by pl."lokerId" ,l.id `);
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
    }

    static async listKebutuhanByLokerId(req, res) {
        const { postLokerId } = req.params;
        let data = await sq.query(`
            select kp.id as "kebutuhanPelamarId", kp."masterKebutuhanId" ,mk."namaKebutuhan" 
            from "kebutuhanPelamar" kp 
            join "masterKebutuhan" mk on mk.id = kp."masterKebutuhanId" 
            join "postLoker" pl on pl.id = kp."postLokerId" 
            join loker l on l.id = pl."lokerId" 
            where kp."postLokerId" = '${postLokerId}'
            and kp."deletedAt" isnull 
            and mk."deletedAt" isnull 
            and pl."deletedAt" isnull 
            and l."deletedAt" isnull  `);
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
    }
}

module.exports = Controller;