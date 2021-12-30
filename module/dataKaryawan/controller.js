const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const dataKaryawan = require("./model");
const kelengkapan = require("../kelengkapanLamaran/model");
const poolPotonganAsuransi = require("../poolPotonganAsusransi/model");
const postLoker = require("../postLoker/model");

class Controller {
  static register(req, res) {
    const {postLokerId,tanggalMulaiKerja,statusKerjaKaryawan,lamaKontrakKaryawan}= req.body;

    kelengkapan.findAll({where:{postLokerId}}).then(async(data)=>{
        if(data.length==0){
            res.status(200).json({ status: 200, message: "data tidak ada"});
        }else{
            let data2 = await sq.query(`select l.id as "lokerId",l."namaLoker",l."masterPosisiId",mp."namaPosisi",mp."masterDivisiId",md."namaDivisi",md."kodeDivisi" from loker l join "masterPosisi" mp on mp.id = l."masterPosisiId" join "masterDivisi" md on md.id = mp."masterDivisiId" join "postLoker" pl on l.id = pl."lokerId" where pl.id = '${postLokerId}'`);
            dataKaryawan.create({id:postLokerId,namaKaryawan:data[0].namaPelamar,nomorKTPKaryawan:data[0].nomorKTPPelamar,tinggiBadanKaryawan:data[0].tinggiBadanPelamar,beratBadanKaryawan:data[0].beratBadanPelamar,agamaKaryawan:data[0].agamaPelamar,kebangsaanKaryawan:data[0].kebangsaanPelamar,jenisKelaminKaryawan:data[0].jenisKelaminPelamar,statusKaryawan:data[0].statusPelamar,tempatLahirKaryawan:data[0].tempatLahirPelamar,tanggalLahirKaryawan:data[0].tanggalLahirPelamar,noHpKaryawan:data[0].noHpPelamar,emailKaryawan:data[0].emailPelamar,alamatKaryawan:data[0].alamatPelamar,tanggalMulaiKerja,statusKerjaKaryawan,lamaKontrakKaryawan,masterPosisiId:data2[0][0].masterPosisiId,masterDivisiId:data2[0][0].masterDivisiId}).then((data3)=>{
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
      const {dataKaryawanId,namaKaryawan,nomorKTPKaryawan,tinggiBadanKaryawan,beratBadanKaryawan,agamaKaryawan,kebangsaanKaryawan,jenisKelaminKaryawan,statusKaryawan,tempatLahirKaryawan,tanggalLahirKaryawan,noHpKaryawan,emailKaryawan,alamatKaryawan,tanggalMulaiKerja,statusKerjaKaryawan,lamaKontrakKaryawan,namaIstriKaryawan,KTPIstriKaryawan,alamatIstriKaryawan,jumlahAnakKaryawan,namaAnak1Karyawan,namaAnak2Karyawan,masterPosisiId,masterDivisiId} = req.body;
    
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
      
      dataKaryawan.update({namaKaryawan,nomorKTPKaryawan,tinggiBadanKaryawan,beratBadanKaryawan,agamaKaryawan,kebangsaanKaryawan,jenisKelaminKaryawan,statusKaryawan,tempatLahirKaryawan,tanggalLahirKaryawan,noHpKaryawan,emailKaryawan,alamatKaryawan,tanggalMulaiKerja,statusKerjaKaryawan,lamaKontrakKaryawan,namaIstriKaryawan,KTPIstriKaryawan,alamatIstriKaryawan,jumlahAnakKaryawan,namaAnak1Karyawan,namaAnak2Karyawan,masterPosisiId,masterDivisiId},{where:{id:dataKaryawanId}}).then((data)=>{
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

  static async list(req, res) {
    let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull`);
    res.status(200).json({ status: 200, message: "sukses",data:data[0]});
  }
  static async detailsById(req, res) {
    const {dataKaryawanId} = req.params
    let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk.id = '${dataKaryawanId}'`);
    let data2 = await sq.query(`select ppa.id as "poolPotonganAsuransiId",ppa."nomorAsuransi",ppa."masterAsuransiId",ma."namaAsuransi" from "poolPotonganAsuransi" ppa join "masterAsuransi" ma on ma.id = ppa."masterAsuransiId" where ppa."deletedAt" isnull and ppa."dataKaryawanId" = '${dataKaryawanId}'`);
    data[0][0].Asuransi = data2[0]
    res.status(200).json({ status: 200, message: "sukses",data:data[0]});
  }
  
  static async listByMasterPosisiId(req, res) {
    const { masterPosisiId } = req.params;
    let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."masterPosisiId" ='${masterPosisiId}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listByMasterDivisiId(req, res) {
    const { masterDivisiId } = req.params;
    let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk."masterDivisiId" ='${masterDivisiId}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

}

module.exports = Controller;
