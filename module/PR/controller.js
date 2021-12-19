const PR = require("./model");
const CC = require("../poCC/model");
const subPR = require("../subPR/model");
const poolHargaSupplier = require("../poolHargaSupplier/model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const PO = require("../PO/model");
const subPO = require("../subPO/model");
const moment = require("moment");


class Controller {
    static async generateNoPR(req,res){
        let db = await PR.findAll();
        let acak = moment().format(`ddYYMMDhhmmssms`);
        let nomorPR = `PR${acak}${db.length}`;
        res.status(200).json({status:200,message:"sukses",nomorPR})
    }
    static register (req,res){
        const {nomorPR,tanggalPR,keteranganPR,masterDivisiId,bulkBarangPR} = req.body;
        PR.findAll({where:{nomorPR}}).then((data)=>{
            if(data.length){
                res.status(200).json({status:200,message:"nomorPR sudah ada"})
            }else{
                const idPR = uuid_v4();
                PR.create({id:idPR,nomorPR,tanggalPR,keteranganPR,masterDivisiId}).then((data2)=>{
                    for (let i = 0; i < bulkBarangPR.length; i++) {
                        bulkBarangPR[i].id = uuid_v4();
                        bulkBarangPR[i].PRId = idPR;
                    }
                    subPR.bulkCreate(bulkBarangPR).then((data3)=>{
                        res.status(200).json({status:200,message:"sukses"});
                    }).catch((err)=>{
                        console.log("bulk",err);
                        res.status(500).json({status:500,message:"gagal",data:err});
                    });
                }).catch((err)=>{
                    console.log("PR-Create",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                })
            }
        }).catch((err)=>{
            console.log("PR-find-all",err);
            res.status(500).json({status:500,message:"gagal",data:err});
        })
    }

    static update (req,res){
        const {PRId,tanggalPR,keteranganPR,masterDivisiId,bulkBarangPR} = req.body;

        PR.findAll({where:{id:PRId}}).then((data)=>{
            if(data.length==0){
                res.status(200).json({status:200,message:"data tidak ada"});
            }else{
                PR.update({tanggalPR,keteranganPR,masterDivisiId},{where:{id:PRId}}).then((data)=>{
                    subPR.destroy({where:{PRId}}).then((data2)=>{
                        for (let i = 0; i < bulkBarangPR.length; i++) {
                            bulkBarangPR[i].id = uuid_v4();
                            bulkBarangPR[i].PRId = PRId;
                        }
                        subPR.bulkCreate(bulkBarangPR).then((data3)=>{
                            res.status(200).json({status:200,message:"sukses"});
                        }).catch((err)=>{
                            console.log("sub-bulk",err);
                            res.status(500).json({status:500,message:"gagal",data:err});
                        });
                    }).catch((err)=>{
                        console.log("sub-destroy",err);
                        res.status(500).json({status:500,message:"gagal",data:err});
                    });
                }).catch((err)=>{
                    console.log("PR-update",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                });
            }
        }).catch((err)=>{
            console.log("PR-FindAll",err);
            res.status(500).json({status:500,message:"gagal",data:err});
        });
    }

    static delete (req,res){
        const {PRId} = req.body;
        PR.findAll({where:{id:PRId}}).then((data)=>{
            if(data.length==0){
                res.status(200).json({status:200,message:"data tidak ada"});
            }else{
                PR.destroy({where:{id:PRId}}).then((data2)=>{
                    subPR.destroy({where:{PRId}}).then((data3)=>{
                        res.status(200).json({status:200,message:"sukses"});
                    }).catch((err)=>{
                        console.log("SUB-Destroy");
                        res.status(500).json({status:500,message:"gagal",data:err});
                    })
                }).catch((err)=>{
                    console.log("PR-Destroy",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                });
            }
        }).catch((err)=>{
            console.log("PR-FindAll",err);
            res.status(500).json({status:500,message:"gagal",data:err});
        });
    }
    
    static async list (req,res){
        // let data =  await sq.query(`select distinct p.id as "idPR",p."nomorPR",p."tanggalPR",p."pembayaranPR",p."TOPPR",p."metodePengirimanPR",p."keteranganPR",p."PPNPR",p."promoPR",p."masterSupplierId",ms."namaSupplier",p."totalHargaPR",p."rencanaTglKedatanganPR",p."masterDivisiId",md."namaDivisi",sum(sp."jumlahSubPR")as "totalBarangPR",p."statusPR",p."createdAt",p."deletedAt" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterSupplier" ms on ms.id = p."masterSupplierId" join "masterDivisi" md on md.id = p."masterDivisiId" where sp."deletedAt" isnull and p."deletedAt" isnull and ms."deletedAt" isnull and md."deletedAt" isnull group by p.id,sp."PRId" ,ms."namaSupplier",md."namaDivisi" order by p."createdAt"`);
        let data = await sq.query(`select p.id as "idPR",p."nomorPR",p."tanggalPR",p."keteranganPR",p."masterDivisiId",md."namaDivisi",p."statusPR",sum(sp."jumlahSubPR") as "totalBarangPR" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterDivisi" md on md.id = p."masterDivisiId" where sp."deletedAt" isnull and p."deletedAt" isnull and md."deletedAt" isnull group by p.id,sp."PRId",md."namaDivisi" order by p."createdAt" `);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }


    static async listBarangByNoPR(req,res){
        const {nomorPR}=req.params;
        // let data =  await sq.query(`select sp.id as "subPRID",sp."jumlahSubPR",sp."hargaBelisubPR",sp."totalHargaPerBarangsubPR",sp."PRId",p."nomorPR",p."createdAt" as "tglPembuatanPR",sp."masterBarangId",mb."namaBarang",mb."masterKategoriBarangId",mkb."namaKategori",sp."createdAt", sp."deletedAt",sp."updatedAt" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterBarang" mb on mb.id = sp."masterBarangId" join "masterKategoriBarang" mkb on mkb.id = mb."masterKategoriBarangId" where sp."deletedAt" isnull and mb."deletedAt" isnull and mkb."deletedAt" isnull and p."nomorPR" = '${nomorPR}' order by sp."createdAt" `);
        let data = await sq.query(`select sp.id as "subPRId", sp."jumlahSubPR", sp."hargaBelisubPR", sp."totalHargaPerBarangsubPR", sp."PRId", p."nomorPR",p."createdAt" as "tglPembuatanPR", sp."masterBarangId",mb."namaBarang",mb."masterKategoriBarangId",mkb."namaKategori" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterBarang" mb on mb.id = sp."masterBarangId" join "masterKategoriBarang" mkb on mkb.id = mb."masterKategoriBarangId" where sp."deletedAt" isnull and p."deletedAt" isnull and mkb."deletedAt" isnull and mb."deletedAt" isnull and p."nomorPR" = '${nomorPR}'`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }

    static async listByStatusPR(req,res){
        const {statusPR}=req.params;
        // let data = await sq.query(`select distinct p.id as "idPR",p."nomorPR",p."tanggalPR",p."pembayaranPR",p."TOPPR",p."metodePengirimanPR",p."keteranganPR",p."PPNPR",p."promoPR",p."masterSupplierId",ms."namaSupplier",p."totalHargaPR",p."rencanaTglKedatanganPR",p."masterDivisiId",md."namaDivisi",sum(sp."jumlahSubPR")as "totalBarangPR" ,p."createdAt",p."deletedAt" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterSupplier" ms on ms.id = p."masterSupplierId" join "masterDivisi" md on md.id = p."masterDivisiId" where sp."deletedAt" isnull and p."deletedAt" isnull and ms."deletedAt" isnull and md."deletedAt" isnull and p."statusPR" = '${statusPR}' group by p.id,sp."PRId" ,ms."namaSupplier",md."namaDivisi" order by p."createdAt"`);
       let data = await sq.query(`select p.id as "idPR",p."nomorPR",p."tanggalPR",p."keteranganPR",p."masterDivisiId",md."namaDivisi",p."statusPR",sum(sp."jumlahSubPR") as "totalBarangPR" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterDivisi" md on md.id = p."masterDivisiId" where sp."deletedAt" isnull and p."deletedAt" isnull and md."deletedAt" isnull and p."statusPR" = ${statusPR} group by p.id,sp."PRId",md."namaDivisi" order by p."createdAt"`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }
}

module.exports = Controller;
