const kelengkapanLamaran = require("./model");
const riwayatPendidikan = require("../riwayatPendidikan/model");
const pengalamanKerja = require("../pengalamanKerja/model");
const kebutuhanPelamar = require("../kebutuhanPelamar/model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

class Controller {
  static register(req, res) {
    const { namaPelamar, nomorKTPPelamar, posisiLamaran, tinggiBadanPelamar, beratBadanPelamar, agamaPelamar, kebangsaanPelamar, jenisKelaminPelamar, statusPelamar, tempatLahirPelamar, tanggalLahirPelamar, noHpPelamar, emailPelamar, alamatPelamar, tanggalMasukLamaran,postLokerId, statusKelengkapan, bulkPengalamanKerja, bulkRiwayatPendidikan } = req.body;
    const idKelengkapanLamaran = uuid_v4();
    kelengkapanLamaran.findAll({
      where: {
        [Op.or]: [{ nomorKTPPelamar }, { postLokerId }]
      }
    }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "data sudah ada" });
      } else {
        kelengkapanLamaran.create({ id: idKelengkapanLamaran, namaPelamar, nomorKTPPelamar, posisiLamaran, tinggiBadanPelamar, beratBadanPelamar, agamaPelamar, kebangsaanPelamar, jenisKelaminPelamar, statusPelamar, tempatLahirPelamar, tanggalLahirPelamar, noHpPelamar, emailPelamar, alamatPelamar, tanggalMasukLamaran, postLokerId, statusKelengkapan, bulkPengalamanKerja, bulkRiwayatPendidikan }).then((data2) => {
          for (let i = 0; i < bulkPengalamanKerja.length; i++) {
            const idPengalamanKerja = uuid_v4();
            bulkPengalamanKerja[i].kelengkapanLamaranId = idKelengkapanLamaran;
            bulkPengalamanKerja[i].id = idPengalamanKerja;
          }
          pengalamanKerja.bulkCreate(bulkPengalamanKerja).then((data3) => {
            for (let i = 0; i < bulkRiwayatPendidikan.length; i++) {
              const idPengalamanKerja = uuid_v4();
              bulkRiwayatPendidikan[i].kelengkapanLamaranId = idKelengkapanLamaran;
              bulkRiwayatPendidikan[i].id = idPengalamanKerja;
            }
            riwayatPendidikan.bulkCreate(bulkRiwayatPendidikan).then((data4) => {
              res.status(200).json({ status: 200, message: "sukses" });
            });
          });
        });
      }
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static list(req, res) {
    kelengkapanLamaran.findAll().then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static detailsById(req, res) {
    const { id } = req.params;
    kelengkapanLamaran.findAll({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static updateAll(req, res) {
    const { id, namaPelamar, nomorKTPPelamar, posisiLamaran, tinggiBadanPelamar, beratBadanPelamar, agamaPelamar, kebangsaanPelamar, jenisKelaminPelamar, statusPelamar, tempatLahirPelamar, tanggalLahirPelamar, noHpPelamar, emailPelamar, alamatPelamar, tanggalMasukLamaran, postLokerId, statusKelengkapan, bulkPengalamanKerja, bulkRiwayatPendidikan } = req.body;
    kelengkapanLamaran.update({ namaPelamar, nomorKTPPelamar, posisiLamaran, tinggiBadanPelamar, beratBadanPelamar, agamaPelamar, kebangsaanPelamar, jenisKelaminPelamar, statusPelamar, tempatLahirPelamar, tanggalLahirPelamar, noHpPelamar, emailPelamar, alamatPelamar, tanggalMasukLamaran, postLokerId, statusKelengkapan, bulkPengalamanKerja, bulkRiwayatPendidikan }, { where: { id }, returning: true }).then((data) => {
      pengalamanKerja.destroy({ where: { kelengkapanLamaranId: id } }).then((data) => {
        for (let i = 0; i < bulkPengalamanKerja.length; i++) {
          const idPengalamanKerja = uuid_v4();
          bulkPengalamanKerja[i].kelengkapanLamaranId = id;
          bulkPengalamanKerja[i].id = idPengalamanKerja;
        }
        pengalamanKerja.bulkCreate(bulkPengalamanKerja).then((data2) => {
          riwayatPendidikan.destroy({ where: { kelengkapanLamaranId: id } }).then((data3) => {
            for (let i = 0; i < bulkRiwayatPendidikan.length; i++) {
              const idRiwayatPendidikan = uuid_v4();
              bulkRiwayatPendidikan[i].kelengkapanLamaranId = id;
              bulkRiwayatPendidikan[i].id = idRiwayatPendidikan;
            }
            riwayatPendidikan.bulkCreate(bulkRiwayatPendidikan).then((data4) => {
              res.status(200).json({ status: 200, message: "sukses", data: data[1] });
            }).catch((err) => {
              res.status(500).json({ status: 500, message: "gagal", data: err });
            })
          })
        })
      })
    });
  }

  static update(req, res) {
    const { id, namaPelamar, nomorKTPPelamar, posisiLamaran, tinggiBadanPelamar, beratBadanPelamar, agamaPelamar, kebangsaanPelamar, jenisKelaminPelamar, statusPelamar, tempatLahirPelamar, tanggalLahirPelamar, noHpPelamar, emailPelamar, alamatPelamar, tanggalMasukLamaran, postLokerId } = req.body;
    kelengkapanLamaran.update({ namaPelamar, nomorKTPPelamar, posisiLamaran, tinggiBadanPelamar, beratBadanPelamar, agamaPelamar, kebangsaanPelamar, jenisKelaminPelamar, statusPelamar, tempatLahirPelamar, tanggalLahirPelamar, noHpPelamar, emailPelamar, alamatPelamar, tanggalMasukLamaran,postLokerId }, { where: { id }, returning: true }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data[1] });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static delete(req, res) {
    const { id } = req.body;
    kelengkapanLamaran.destroy({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static async detailKelengkapan(req, res) {
    let data = await sq.query(`
    select kl.id as "kelengkapanLamaranId",kl."namaPelamar" ,kl."nomorKTPPelamar" ,kl."posisiLamaran" ,kl."tinggiBadanPelamar" ,kl."beratBadanPelamar" ,kl."agamaPelamar" ,kl."kebangsaanPelamar" ,kl."jenisKelaminPelamar" ,kl."statusPelamar" ,kl."tempatLahirPelamar" ,kl."noHpPelamar" ,kl."emailPelamar" ,kl."alamatPelamar" ,kl."tanggalMasukLamaran"  ,kl."postLokerId" ,pl."namaPengirim" ,pl."emailPengirim" ,pl."alamatPengirim" ,pl."statusPostLoker" ,pl."CV" ,pl."lokerId" ,kl."createdAt" ,kl."updatedAt" ,kl."deletedAt" from "kelengkapanLamaran" kl 
    join "postLoker" pl on pl.id = kl."postLokerId" 
    where kl."deletedAt" isnull 
    and pl."deletedAt" isnull`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static updateFile(req,res){
    const {kebutuhanPelamarId} = req.body;
    let file1="";
    kebutuhanPelamar.findAll({where:{id:kebutuhanPelamarId}}).then((data)=>{
      if(data.length==0){
        res.status(200).json({status:200,message:"data tidak ada"});
      }else{
        if(req.files){
          if(req.files.file1){
            file1=req.files.file1[0].filename;
          }
        }
        kebutuhanPelamar.update({statusKebutuhan:1,fileKebutuhan:file1},{where:{id:kebutuhanPelamarId}}).then((data2)=>{
          res.status(200).json({status:200,message:"sukses",data:file1});
        }).catch((err)=>{
          console.log("update",err);
          res.status(500).json({status:500,message:"gagal",data:err});
        });
      }
    }).catch((err)=>{
      console.log("find-all",err);
      res.status(500).json({status:500,message:"gagal",data:err});
    })
  }
  // static updateFile(req,res){
  //   const {masterKebutuhanId,postLokerId} = req.body;
  //   // let file1="";
  //   kebutuhanPelamar.findAll({where:{masterKebutuhanId,postLokerId}}).then(async(data)=>{
  //     if(data.length==0){
  //       res.status(200).json({status:200,message:"data tidak ada"});
  //     }else{
  //       if(req.files){
  //         if(req.files.file1){
  //           // file1=req.files.file1[0].filename;
  //           await sq.query(`update "kebutuhanPelamar" set "fileKebutuhan"='${req.files.file1[0].filename}' where "masterKebutuhanId" = '${masterKebutuhanId}' and "postLokerId"='${postLokerId}'`)
  //         }
  //       }
  //       kebutuhanPelamar.update({statusKebutuhan:1},{where:{masterKebutuhanId,postLokerId}}).then((data2)=>{
  //         res.status(200).json({status:200,message:"sukses"});
  //       }).catch((err)=>{
  //         console.log("update",err);
  //         res.status(500).json({status:500,message:"gagal",data:err});
  //       });
  //     }
  //   }).catch((err)=>{
  //     console.log("find-all",err);
  //     res.status(500).json({status:500,message:"gagal",data:err});
  //   })
  // }
}

module.exports = Controller;