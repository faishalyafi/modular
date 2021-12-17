const formula = require("./model");
const subFormula = require("../subFormula/model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
  static register(req, res) {
    const { keteranganFormula, ketahananBarang, masterBarangId, bulkSubFormula } = req.body;
    const idFormula=uuid_v4()
    formula.findAll({ where: {keteranganFormula}}).then((data)=>{
        if(data.length){
            res.status(200).json({status:200,message:"data sudah ada"});
        }
        else{
            formula.create({id:idFormula,keteranganFormula,ketahananBarang,masterBarangId}).then((data2)=>{
                for (let i = 0; i < bulkSubFormula.length; i++) {
                    bulkSubFormula[i].id = uuid_v4();
                    bulkSubFormula[i].formulaId = idFormula;
                }
                subFormula.bulkCreate(bulkSubFormula).then((data3)=>{
                    res.status(200).json({status:200, message:"sukses"});
                }).catch((err)=>{
                    res.status(500).json({status:500, message:"gagal",data:err});
                });
            });
        }
    });
  }

  static async list(req, res) {
    // let data = await sq.query(`select f.id as "formulaId", f."keteranganFormula" , f."isActive" , f."createdAt" ,f."ketahananBarang" ,f."masterBarangId" ,mb."namaBarang",mb.barcode ,mb.foto,(select sum(sf."jumlahBarangFormula") as "jumlahTotalBarang" from "subFormula" sf where sf."deletedAt" isnull and sf."formulaId" = f.id group by sf."formulaId"),(select count(sf."masterBarangId") as "jumlahJenisBarang" from "subFormula" sf where sf."deletedAt" isnull and sf."formulaId" = f.id group by sf."formulaId") from formula f join "masterBarang" mb on mb.id = f."masterBarangId" where f."deletedAt" isnull and f."isActive" = 1 order by f."createdAt"`);
    let data = await sq.query(`select f.id as "formulaId", f."keteranganFormula" , f."isActive" , f."createdAt" ,f."ketahananBarang" ,f."masterBarangId" ,mb."namaBarang",mb.barcode ,mb.foto,(select sum(sf."jumlahBarangFormula") as "jumlahTotalBarang" from "subFormula" sf where sf."deletedAt" isnull and sf."formulaId" = f.id group by sf."formulaId"),(select count(sf."masterBarangId") as "jumlahJenisBarang" from "subFormula" sf where sf."deletedAt" isnull and sf."formulaId" = f.id group by sf."formulaId") from formula f join "masterBarang" mb on mb.id = f."masterBarangId" where f."deletedAt" isnull order by f."createdAt"`);
    res.status(200).json({status: 200,message: "sukses",data: data[0]});
  }

  static async detailsFormulaById(req, res) {
    const { idFormula } = req.params;
    let data = await sq.query(`select sf.id as "subFormulaId", sf."jumlahBarangFormula" ,sf."masterBarangId",mb."namaBarang" , mb.barcode ,mb."kodeBarang"  from "subFormula" sf join formula f on sf."formulaId" = f.id join "masterBarang" mb on mb.id = sf."masterBarangId" where f."deletedAt" isnull and sf."deletedAt" isnull and mb."deletedAt" isnull and f."isActive" = 1 and f.id = '${idFormula}'`)
    res.status(200).json({status:200,message:"sukses",data:data[0]})
  }

  // static updateIsActive(req, res) {
  //   const {idFormula,isActive} = req.body;
  //   formula.update({isActive},{ where: { id:idFormula }}).then((data) => {
  //       res.status(200).json({ status: 200, message: "sukses"});
  //     }).catch((err) => {
  //       res.status(500).json({ status: 500, message: "gagal", data: err });
  //     });
  // }

  static delete(req, res) {
    const { id,isActive } = req.body;
    //const isActive = 0;
      formula.update({isActive},{where:{id}}).then((data)=>{
        res.status(200).json({status:200,message:"sukses"});
      }).catch((err)=>{
        res.status(500).json({status:500,message:"gagal",data:err})
      })
    }

  // static listBarangByGudangId(req, res) {

  // }
}

module.exports = Controller;
