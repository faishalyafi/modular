const postLoker = require("../model/postLokerModel");
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
        postLoker
            .create({ id: uuid_v4(), namaPengirim, emailPengirim, alamatPengirim, statusPostLoker, lokerId, CV: fileCV })
            .then((data) => {
                kirimEmail.kirim(data.emailPengirim);
                res.status(200).json({ status: 200, message: "sukses", });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
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
        let kolomKelengkapan = "";
        let joinTable = "";
        if (statusPostLoker == 0) {
            kolomKelengkapan = "";
            joinTable = "";
        } else if (statusPostLoker == 1) {
            kolomKelengkapan = `,kl.id as "kelengkapanLamaranId",kl."namaPelamar" ,kl."nomorKTPPelamar" ,kl."posisiLamaran" ,kl."tinggiBadanPelamar" ,kl."beratBadanPelamar" ,kl."agamaPelamar" ,kl."kebangsaanPelamar" ,kl."jenisKelaminPelamar" ,kl."statusPelamar" ,kl."tempatLahirPelamar" ,kl."tanggalLahirPelamar" ,kl."noHpPelamar" ,kl."emailPelamar" ,kl."alamatPelamar" ,kl."tanggalMasukLamaran" ,kl."daftarRiwayatHidup" ,kl."pasFoto4x6" ,kl."pasFoto3x4" ,kl."fotoCopyKTP" ,kl."fotoCopyKK" ,kl."fotoCopyIjazah" ,kl."fotoCopySuratSehat" ,kl."fotoCopySKCK" ,kl."kartuJKK" ,kl."statusKelengkapan" ,kl."createdAt" ,kl."updatedAt" ,kl."deletedAt" `;
            joinTable = `left join "kelengkapanLamaran" kl on kl."postLokerId" = pl.id  `;
        }
        let hasil = [];
        let data = await sq.query(`
        select pl.id as "postLokerId",pl."namaPengirim" ,pl."emailPengirim" ,pl."alamatPengirim" ,pl."statusPostLoker" ,pl."lokerId" ,l."namaLoker" ,l."masterPosisiId" ,mp."namaPosisi" ,pl."CV", pl."createdAt" ,pl."updatedAt" ,pl."deletedAt" ${kolomKelengkapan}
        from "postLoker" pl ${joinTable}
        join loker l on l.id = pl."lokerId" 
        join "masterPosisi" mp on mp.id = l."masterPosisiId" 
        where pl."deletedAt" isnull 
        and l."deletedAt" isnull 
        and mp."deletedAt" isnull 
        and pl."statusPostLoker" = ${statusPostLoker}`);
        let dataPL = data[0];

        for (let i = 0; i < dataPL.length; i++) {
            let dataPl = {
                postLokerId: dataPL[i].postLokerId,
                namaPengirim: dataPL[i].namaPengirim,
                emailPengirim: dataPL[i].emailPengirim,
                alamatPengirim: dataPL[i].alamatPengirim,
                statusPostLoker: dataPL[i].statusPostLoker,
                lokerId: dataPL[i].lokerId,
                namaLoker: dataPL[i].namaLoker,
                masterPosisiId: dataPL[i].masterPosisiId,
                namaPosisi: dataPL[i].namaPosisi,
                CV: dataPL[i].CV,
                createdAt: dataPL[i].createdAt,
                updatedAt: dataPL[i].updatedAt,
                deletedAt: dataPL[i].deletedAt,
                kelengkapanLamaranId: dataPL[i].kelengkapanLamaranId,
                namaPelamar: dataPL[i].namaPelamar,
                nomorKTPPelamar: dataPL[i].nomorKTPPelamar,
                posisiLamaran: dataPL[i].posisiLamaran,
                tinggiBadanPelamar: dataPL[i].tinggiBadanPelamar,
                beratBadanPelamar: dataPL[i].beratBadanPelamar,
                agamaPelamar: dataPL[i].agamaPelamar,
                kebangsaanPelamar: dataPL[i].kebangsaanPelamar,
                jenisKelaminPelamar: dataPL[i].jenisKelaminPelamar,
                statusPelamar: dataPL[i].statusPelamar,
                tempatLahirPelamar: dataPL[i].tempatLahirPelamar,
                tanggalLahirPelamar: dataPL[i].tanggalLahirPelamar,
                noHpPelamar: dataPL[i].noHpPelamar,
                emailPelamar: dataPL[i].emailPelamar,
                alamatPelamar: dataPL[i].alamatPelamar,
                tanggalMasukLamaran: dataPL[i].tanggalMasukLamaran,
                daftarRiwayatHidup: dataPL[i].daftarRiwayatHidup,
                pasFoto4x6: dataPL[i].pasFoto4x6,
                pasFoto3x4: dataPL[i].pasFoto3x4,
                fotoCopyKTP: dataPL[i].fotoCopyKTP,
                fotoCopyKK: dataPL[i].fotoCopyKK,
                fotoCopyIjazah: dataPL[i].fotoCopyIjazah,
                fotoCopySuratSehat: dataPL[i].fotoCopySuratSehat,
                fotoCopySKCK: dataPL[i].fotoCopySKCK,
                kartuJKK: dataPL[i].kartuJKK,
                statusKelengkapan: dataPL[i].statusKelengkapan,
            }
            hasil.push(dataPl);
        }

        res.status(200).json({ status: 200, message: "sukses", data: hasil });
    }

    static async detailListByStatus(req, res) {
        let {statusPostLoker, postLokerId} = req.params;
        let kolomKelengkapan = "";
        let joinTable = "";
        if (statusPostLoker == 0) {
            kolomKelengkapan = "";
            joinTable = "";
        } else if (statusPostLoker == 1) {
            kolomKelengkapan = `,kl.id as "kelengkapanLamaranId",kl."namaPelamar" ,kl."nomorKTPPelamar" ,kl."posisiLamaran" ,kl."tinggiBadanPelamar" ,kl."beratBadanPelamar" ,kl."agamaPelamar" ,kl."kebangsaanPelamar" ,kl."jenisKelaminPelamar" ,kl."statusPelamar" ,kl."tempatLahirPelamar" ,kl."tanggalLahirPelamar" ,kl."noHpPelamar" ,kl."emailPelamar" ,kl."alamatPelamar" ,kl."tanggalMasukLamaran" ,kl."daftarRiwayatHidup" ,kl."pasFoto4x6" ,kl."pasFoto3x4" ,kl."fotoCopyKTP" ,kl."fotoCopyKK" ,kl."fotoCopyIjazah" ,kl."fotoCopySuratSehat" ,kl."fotoCopySKCK" ,kl."kartuJKK" ,kl."statusKelengkapan" ,kl."createdAt" ,kl."updatedAt" ,kl."deletedAt" `;
            joinTable = `left join "kelengkapanLamaran" kl on kl."postLokerId" = pl.id  `;
        }
        
        let data = await sq.query(`
        select pl.id as "postLokerId",pl."namaPengirim" ,pl."emailPengirim" ,pl."alamatPengirim" ,pl."statusPostLoker" ,pl."lokerId" ,l."namaLoker" ,l."masterPosisiId" ,mp."namaPosisi" ,pl."CV", pl."createdAt" ,pl."updatedAt" ,pl."deletedAt" ${kolomKelengkapan}
        from "postLoker" pl ${joinTable}
        join loker l on l.id = pl."lokerId" 
        join "masterPosisi" mp on mp.id = l."masterPosisiId" 
        where pl."deletedAt" isnull 
        and l."deletedAt" isnull 
        and mp."deletedAt" isnull 
        and pl."statusPostLoker" = ${statusPostLoker} 
        and pl.id = '${postLokerId}'`);
        
        let dataPL = data[0][0];

        let data2 = await sq.query(`
        select * 
        from "riwayatPendidikan" rp 
        where rp."kelengkapanLamaranId" = '${data[0][0].kelengkapanLamaranId}' 
        and rp."deletedAt" isnull `);

        let data3 = await sq.query(`
        select * 
        from "pengalamanKerja" pk 
        where pk."kelengkapanLamaranId" = '${data[0][0].kelengkapanLamaranId}' 
        and pk."deletedAt" isnull `);
        
        dataPL.riwayatPendidikan = data2[0];
        dataPL.pengalamanKerja = data3[0];

        res.status(200).json({ status: 200, message: "sukses", data: dataPL });
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
        postLoker.destroy({ where: { id: id } })
            .then((data) => {
                res.status(200).json({ status: 200, message: "sukses" });
            })
            .catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
            });
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
}

module.exports = Controller;