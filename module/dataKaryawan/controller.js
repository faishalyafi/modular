const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const dataKaryawan = require("./model");
const kelengkapan = require("../kelengkapanLamaran/model");
const poolPotonganAsuransi = require("../poolPotonganAsusransi/model");
const postLoker = require("../postLoker/model");

class Controller {
  static register(req, res) {
    const {postLokerId,tanggalMulaiKerja,statusKerjaKaryawan,lamaKontrakKaryawan, masterShiftId}= req.body;

    kelengkapan.findAll({where:{postLokerId}}).then(async(data)=>{
        if(data.length==0){
            res.status(200).json({ status: 200, message: "data tidak ada"});
        }else{
            let data2 = await sq.query(`select l.id as "lokerId",l."namaLoker",l."masterPosisiId",mp."namaPosisi",mp."masterDivisiId",md."namaDivisi",md."kodeDivisi" from loker l join "masterPosisi" mp on mp.id = l."masterPosisiId" join "masterDivisi" md on md.id = mp."masterDivisiId" join "postLoker" pl on l.id = pl."lokerId" where pl.id = '${postLokerId}'`);
            dataKaryawan.create({id:postLokerId,namaKaryawan:data[0].namaPelamar,nomorKTPKaryawan:data[0].nomorKTPPelamar,tinggiBadanKaryawan:data[0].tinggiBadanPelamar,beratBadanKaryawan:data[0].beratBadanPelamar,agamaKaryawan:data[0].agamaPelamar,kebangsaanKaryawan:data[0].kebangsaanPelamar,jenisKelaminKaryawan:data[0].jenisKelaminPelamar,statusKaryawan:data[0].statusPelamar,tempatLahirKaryawan:data[0].tempatLahirPelamar,tanggalLahirKaryawan:data[0].tanggalLahirPelamar,noHpKaryawan:data[0].noHpPelamar,emailKaryawan:data[0].emailPelamar,alamatKaryawan:data[0].alamatPelamar,tanggalMulaiKerja,statusKerjaKaryawan,lamaKontrakKaryawan,masterPosisiId:data2[0][0].masterPosisiId,masterDivisiId:data2[0][0].masterDivisiId,masterShiftId}).then((data3)=>{
              postLoker.update({statusPostLoker: 4},{where:{id:postLokerId}}).then((data4)=>{
                res.status(200).json({ status: 200, message: "sukses"});
              });
            });
          }
    }).catch((err)=>{
        console.log("find-All",err);
        res.status(500).json({status: 500,message: "gagal",data: err});
    });
  }

  static update(req, res) {
      const {dataKaryawanId,namaKaryawan,nomorKTPKaryawan,tinggiBadanKaryawan,beratBadanKaryawan,agamaKaryawan,kebangsaanKaryawan,jenisKelaminKaryawan,statusKaryawan,tempatLahirKaryawan,tanggalLahirKaryawan,noHpKaryawan,emailKaryawan,alamatKaryawan,tanggalMulaiKerja,statusKerjaKaryawan,lamaKontrakKaryawan,namaIstriKaryawan,KTPIstriKaryawan,alamatIstriKaryawan,jumlahAnakKaryawan,namaAnak1Karyawan,namaAnak2Karyawan,masterPosisiId,masterDivisiId,masterShiftId} = req.body;
    
      if(req.files){
        if(req.files.file1){
        let fotoProfilKaryawan = req.files.file1[0].filename;
        dataKaryawan.update({fotoProfilKaryawan},{where:{id:dataKaryawanId}});
        } 
        if(req.files.file2){
        let fotoKKKaryawan = req.files.file2[0].filename;
        dataKaryawan.update({fotoKKKaryawan},{where:{id:dataKaryawanId}});
        }
      }
      
      dataKaryawan.update({namaKaryawan,nomorKTPKaryawan,tinggiBadanKaryawan,beratBadanKaryawan,agamaKaryawan,kebangsaanKaryawan,jenisKelaminKaryawan,statusKaryawan,tempatLahirKaryawan,tanggalLahirKaryawan,noHpKaryawan,emailKaryawan,alamatKaryawan,tanggalMulaiKerja,statusKerjaKaryawan,lamaKontrakKaryawan,namaIstriKaryawan,KTPIstriKaryawan,alamatIstriKaryawan,jumlahAnakKaryawan,namaAnak1Karyawan,namaAnak2Karyawan,masterPosisiId,masterDivisiId,masterShiftId},{where:{id:dataKaryawanId}}).then((data)=>{
       res.status(200).json({ status: 200, message: "sukses"});
      }).catch((err)=>{
       res.status(500).json({status: 500,message: "gagal",data: err});
      });
    }

  static delete(req, res) {
    const {dataKaryawanId} = req.body;
    dataKaryawan.destroy({where:{id:dataKaryawanId}}).then((data)=>{
      poolPotonganAsuransi.destroy({where:{dataKaryawanId}}).then((data2)=>{
        res.status(200).json({ status: 200, message: "sukses"});
      });
    }).catch((err)=>{
      res.status(500).json({status: 500,message: "gagal",data: err});
    })
  }

  static pecatKaryawan (req,res){
    const {dataKaryawanId,masterKeteranganKaryawanKeluarId,statusKerjaKaryawan} = req.body;
    
    dataKaryawan.findAll({where:{id:dataKaryawanId}}).then((data)=>{
      if(data.length==0){
        res.status(200).json({ status: 200, message: "data tidak ada"});
      }else{
        dataKaryawan.update({statusKerjaKaryawan,masterKeteranganKaryawanKeluarId},{where:{id:dataKaryawanId}}).then((data2)=>{
          res.status(200).json({ status: 200, message: "sukses"});
        });
      }
    }).catch((err)=>{
      res.status(500).json({status: 500,message: "gagal",data: err});
    })
  }

  static async list(req, res) {
    // let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull`);
    let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi",mkkk."keteranganKaryawanKeluar" from "dataKaryawan" dk left join "masterKeteranganKaryawanKeluar" mkkk on mkkk.id = dk."masterKeteranganKaryawanKeluarId" join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."statusKerjaKaryawan" < 2 order by dk."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses",data:data[0]});
  }
  static async detailsById(req, res) {
    const {dataKaryawanId} = req.params
    // let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk.id = '${dataKaryawanId}'`);
    // let data2 = await sq.query(`select ppa.id as "poolPotonganAsuransiId",ppa."nomorAsuransi",ppa."masterAsuransiId",ma."namaAsuransi" from "poolPotonganAsuransi" ppa join "masterAsuransi" ma on ma.id = ppa."masterAsuransiId" where ppa."deletedAt" isnull and ppa."dataKaryawanId" = '${dataKaryawanId}'`);
    let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi",mkkk."keteranganKaryawanKeluar" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" left join "masterKeteranganKaryawanKeluar" mkkk on mkkk.id = dk."masterKeteranganKaryawanKeluarId" where dk."deletedAt" isnull and mp."deletedAt" isnull and md."deletedAt" isnull and dk.id = '${dataKaryawanId}'`);
    let data2 = await sq.query(`select ppa.id as "poolPotonganAsuransiId",ppa."nomorAsuransi",ppa."masterAsuransiId",ma."namaAsuransi" from "poolPotonganAsuransi" ppa join "masterAsuransi" ma on ma.id = ppa."masterAsuransiId" where ppa."deletedAt" isnull and ppa."dataKaryawanId" = '${dataKaryawanId}'`);
    data[0][0].Asuransi = data2[0]
    res.status(200).json({ status: 200, message: "sukses",data:data[0]});
  }
  
  static async listByMasterPosisiId(req, res) {
    const { masterPosisiId } = req.params;
    // let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."masterPosisiId" ='${masterPosisiId}'`);
    let data =  await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi",mkkk."keteranganKaryawanKeluar" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" left join "masterKeteranganKaryawanKeluar" mkkk on mkkk.id = dk."masterKeteranganKaryawanKeluarId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."statusKerjaKaryawan" < 2 and dk."masterPosisiId" ='${masterPosisiId}' order by dk."createdAt" `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listByMasterDivisiId(req, res) {
    const { masterDivisiId } = req.params;
    // let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."masterDivisiId" ='${masterDivisiId}'`);
    let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi",mkkk."keteranganKaryawanKeluar" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" left join "masterKeteranganKaryawanKeluar" mkkk on mkkk.id = dk."masterKeteranganKaryawanKeluarId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."statusKerjaKaryawan" < 2 and dk."masterDivisiId" ='${masterDivisiId}' order by dk."createdAt" `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listKaryawanWNA(req,res){
    // let data =  await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."kodePosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and md."deletedAt" isnull and dk."kebangsaanKaryawan" = 'WNA' order by dk."createdAt"`);
    let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."kodePosisi",md."namaDivisi",md."kodeDivisi",mkkk."keteranganKaryawanKeluar" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" left join "masterKeteranganKaryawanKeluar" mkkk on mkkk.id = dk."masterKeteranganKaryawanKeluarId" where dk."deletedAt" isnull and mp."deletedAt" isnull and md."deletedAt" isnull and dk."statusKerjaKaryawan" < 2 and dk."kebangsaanKaryawan" = 'WNA' order by dk."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0]});
  }

  static async listKaryawanByStatus(req,res){
    const {statusKerjaKaryawan} = req.params
    // let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."kodePosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and md."deletedAt" isnull and dk."statusKerjaKaryawan" = ${statusKerjaKaryawan} order by dk."createdAt"`);
    let data =  await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."kodePosisi",md."namaDivisi",md."kodeDivisi",mkkk."keteranganKaryawanKeluar" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" left join "masterKeteranganKaryawanKeluar" mkkk on mkkk.id = dk."masterKeteranganKaryawanKeluarId" where dk."deletedAt" isnull and mp."deletedAt" isnull and md."deletedAt" isnull and dk."statusKerjaKaryawan" = ${statusKerjaKaryawan} order by dk."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0]});
  }

  static async listByMasterShiftId(req, res) {
    const { masterShiftId } = req.params;
    // let data = await sq.query(`select dk.id as "dataKaryawanId",ms."namaShift" ,ms."jamAwal" ,ms."jamAkhir" ,dk.*,mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" join "masterShift" ms on ms.id=dk."masterShiftId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."masterShiftId" ='${masterShiftId}'`);
    let data = await sq.query(`select dk.id as "dataKaryawanId",ms."namaShift" ,ms."jamAwal" ,ms."jamAkhir" ,dk.*,mp."namaPosisi",md."namaDivisi",md."kodeDivisi",mkkk."keteranganKaryawanKeluar" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" join "masterShift" ms on ms.id=dk."masterShiftId" left join "masterKeteranganKaryawanKeluar" mkkk on mkkk.id = dk."masterKeteranganKaryawanKeluarId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."statusKerjaKaryawan" <2 and dk."masterShiftId" ='${masterShiftId}' order by dk."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
  static async totalKaryawanAktif(req, res) {
    let data = await sq.query(`select count(id) AS "totalKaryawan" from "dataKaryawan" dk 
    where dk."deletedAt" isnull and "masterKeteranganKaryawanKeluarId" isnull`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
  static async listTotalKaryawanPerDivisi(req, res) {
    let data = await sq.query(`select md."namaDivisi" ,count("masterDivisiId") as "totalKaryawan" from "dataKaryawan" dk 
    join "masterDivisi" md on md.id=dk."masterDivisiId" 
    where dk."deletedAt" isnull and md."deletedAt" isnull and dk."masterKeteranganKaryawanKeluarId" isnull
    group by md."namaDivisi",dk."masterDivisiId" 
    order by md."namaDivisi"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

}

module.exports = Controller;
