const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const poolPotonganAsuransi = require("./model");

class Controller {
  static register(req, res) {
      const {nomorAsuransi,potonganAsuransi,masterAsuransiId,dataKaryawanId} = req.body;
      poolPotonganAsuransi.create({id:uuid_v4(),nomorAsuransi,potonganAsuransi,masterAsuransiId,dataKaryawanId}).then((data)=>{
        res.status(200).json({ status: 200, message: "sukses"});
      }).catch((err)=>{
        res.status(500).json({status: 500,message: "gagal",data: err});
      });
  }

  static update(req, res) {
    const {poolPotonganAsuransiId,nomorAsuransi,potonganAsuransi,masterAsuransiId,dataKaryawanId} = req.body;
    poolPotonganAsuransi.update({nomorAsuransi,potonganAsuransi,masterAsuransiId,dataKaryawanId},{where:{id:poolPotonganAsuransiId}}).then((data)=>{
        res.status(200).json({ status: 200, message: "sukses"});
    }).catch((err)=>{
        res.status(500).json({status: 500,message: "gagal",data: err});
    });
  }

  static delete(req, res) {
    const {poolPotonganAsuransiId}=req.body;
    poolPotonganAsuransi.destroy({where:{id:poolPotonganAsuransiId}}).then((data)=>{
      res.status(200).json({ status: 200, message: "sukses"});
    }).catch((err)=>{
      res.status(500).json({status: 500,message: "gagal",data: err});
    });
  }

  static async list(req, res) {
    let data =  await sq.query(`select ppa .id as"poolPotonganId",ppa.*,ma."namaAsuransi",dk."namaKaryawan" from "poolPotonganAsuransi" ppa join "masterAsuransi" ma on ma.id = ppa."masterAsuransiId" join "dataKaryawan" dk on dk.id = ppa."dataKaryawanId" where ppa."deletedAt" isnull and ma."deletedAt" isnull and dk."deletedAt" isnull `);
    res.status(200).json({ status: 200, message: "sukses",data:data[0]});
  }

  static async listByMasterAsuransiId(req, res) {
    const { masterAsuransiId } = req.params;
    let data = await sq.query(`select ppa .id as"poolPotonganId",ppa.*,ma."namaAsuransi",dk."namaKaryawan" from "poolPotonganAsuransi" ppa join "masterAsuransi" ma on ma.id = ppa."masterAsuransiId" join "dataKaryawan" dk on dk.id = ppa."dataKaryawanId" where ppa."deletedAt" isnull and ma."deletedAt" isnull and dk."deletedAt" isnull and ppa."masterAsuransiId" = '${masterAsuransiId}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listByDataKaryawanId(req, res) {
    const { dataKaryawanId } = req.params;
    let data = await sq.query(`select ppa .id as"poolPotonganId",ppa.*,ma."namaAsuransi",dk."namaKaryawan" from "poolPotonganAsuransi" ppa join "masterAsuransi" ma on ma.id = ppa."masterAsuransiId" join "dataKaryawan" dk on dk.id = ppa."dataKaryawanId" where ppa."deletedAt" isnull and ma."deletedAt" isnull and dk."deletedAt" isnull and ppa."dataKaryawanId" = '${dataKaryawanId}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

    // static async detailsById(req, res) {
  //   const {dataKaryawanId} = req.params
  //   let data = await sq.query(`select dk.id as "dataKaryawanId",dk.*,mp."namaPosisi",mp."namaPosisi",md."namaDivisi",md."kodeDivisi" from "dataKaryawan" dk join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id = dk."masterDivisiId" where dk."deletedAt" isnull and mp."deletedAt" isnull and dk."deletedAt" isnull and dk.id = '${dataKaryawanId}'`);
  //   res.status(200).json({ status: 200, message: "sukses",data:data[0]});
  // }
  
}

module.exports = Controller;
