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

    static register(req,res){
        const {nomorPR,tanggalPR,rencanaTglKedatanganPR,masterSupplierId,pembayaranPR,TOPPR,metodePengirimanPR,totalHargaPR,keteranganPR,PPNPR,bulkCCPR,promoPR,revPR,bulkBarangPR,masterDivisiId}=req.body;
        const idPR = uuid_v4();
        PR.findAll({where:{nomorPR}}).then((data)=>{
            if(data.length){
                res.status(200).json({status:200,message:"nomorPR sudah ada"})
            }else{
                PR.create({id:idPR,nomorPR,tanggalPR,rencanaTglKedatanganPR,masterSupplierId,pembayaranPR,TOPPR,metodePengirimanPR,totalHargaPR,keteranganPR,PPNPR,promoPR,revPR,masterDivisiId}).then((data2)=>{
                    for (let i = 0; i < bulkCCPR.length; i++) {
                        bulkCCPR[i].id=uuid_v4();
                        bulkCCPR[i].PRId=idPR;
                    }
                    CC.bulkCreate(bulkCCPR).then((data3)=>{
                        for (let j = 0; j < bulkBarangPR.length; j++) {
                            bulkBarangPR[j].id=uuid_v4();
                            bulkBarangPR[j].PRId=idPR;
                        }
                        subPR.bulkCreate(bulkBarangPR).then((data4)=>{
                            for (let k = 0; k < bulkBarangPR.length; k++) {
                                bulkBarangPR[k].id = bulkBarangPR[k].masterBarangId+"-"+masterSupplierId;
                                bulkBarangPR[k].masterSupplierId=masterSupplierId;
                                bulkBarangPR[k].hargaBeli=bulkBarangPR[k].hargaBelisubPR;
                            }
                            poolHargaSupplier.bulkCreate(bulkBarangPR,{updateOnDuplicate:["hargaBeli"]}).then((data5)=>{
                                res.status(200).json({status:200,message:"sukses"});
                            }).catch((err)=>{
                                console.log("PoolHargaSuplier",err);
                                res.status(500).json({status:500,message:"gagal",data:err});
                            });
                        }).catch((err)=>{
                            console.log("subPR",err);
                            res.status(500).json({status:500,message:"gagal",data:err});    
                        });
                    }).catch((err)=>{
                        console.log("CC",err);
                        res.status(500).json({status:500,message:"gagal",data:err});
                    });
                }).catch((err)=>{
                    console.log("PR-Create",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                });
            }
        }).catch((err)=>{
            console.log("find-all",err);
            res.status(500).json({status:500,message:"gagal",data:err});
        });
    }
    
    static async update (req,res){
        const {PRId,tanggalPR,rencanaTglKedatanganPR,masterSupplierId,pembayaranPR,TOPPR,metodePengirimanPR,totalHargaPR,keteranganPR,PPNPR,bulkCCPR,promoPR,revPR,bulkBarangPR,masterDivisiId}=req.body;
        PR.findAll({where:{id:PRId}}).then((data)=>{
            if(data.length==0){
                res.status(200).json({status:200,message:"data tidak ada"});
            }else{
                PR.update({tanggalPR,rencanaTglKedatanganPR,masterSupplierId,pembayaranPR,TOPPR,metodePengirimanPR,totalHargaPR,keteranganPR,PPNPR,promoPR,revPR,bulkBarangPR},{where:{id:PRId}}).then((data2)=>{
                    subPR.destroy({where:{PRId:PRId}}).then((data3)=>{
                        for (let i = 0; i < bulkBarangPR.length; i++) {
                            bulkBarangPR[i].id=uuid_v4();
                            bulkBarangPR[i].PRId=PRId;
                        }
                        subPR.bulkCreate(bulkBarangPR).then((data4)=>{
                            for (let j = 0; j < bulkBarangPR.length; j++) {
                                bulkBarangPR[j].id = bulkBarangPR[j].masterBarangId+"-"+masterSupplierId;
                                bulkBarangPR[j].masterSupplierId = masterSupplierId;  
                                bulkBarangPR[j].hargaBeli=bulkBarangPR[j].hargaBelisubPR;           
                            }
                            poolHargaSupplier.bulkCreate(bulkBarangPR,{updateOnDuplicate:["hargaBeli"]}).then((data5)=>{
                                CC.destroy({where:{PRId}}).then((data6)=>{
                                    for (let j = 0; j < bulkCCPR.length; j++) {
                                        bulkCCPR[j].id=uuid_v4();
                                        bulkCCPR[j].PRId=PRId;
                                    }
                                    CC.bulkCreate(bulkCCPR).then((data7)=>{
                                        res.status(200).json({status:200,message:"sukses"});
                                    }).catch((err)=>{
                                        console.log("CC-bulk");
                                        res.status(500).json({status:500,message:"gagal",data:err});
                                    });
                                }).catch((err)=>{
                                    console.log("CC-destroy");
                                    res.status(500).json({status:500,message:"gagal",data:err});
                                });
                            }).catch((err)=>{
                                console.log("POOL");
                                res.status(500).json({status:500,message:"gagal",data:err});
                            });
                        }).catch((err)=>{
                            console.log("sub-bulk",err);
                            res.status(500).json({status:500,message:"gagal",data:err});
                        });
                    }).catch((err)=>{
                        console.log("sub-destroy",err);
                        res.status(500).json({status:500,message:"gagal",data:err});
                    });
                }).catch((err)=>{
                    console.log("update",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                });
            }
        }).catch((err)=>{
            console.log("find-all",err);
            res.status(500).json({status:500,message:"gagal",data:err});
        });
    }

    static delete(req,res){
        const {PRId}=req.body;
        PR.destroy({where:{id:PRId}}).then((data)=>{
            subPR.destroy({where:{PRId}}).then((data2)=>{
                CC.destroy({where:{PRId}}).then((data3)=>{
                    res.status(200).json({status:200,message:"sukses"});
                }).catch((err)=>{
                    console.log("CC",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                });
            }).catch((err)=>{
                console.log("subPR",err);
                res.status(500).json({status:500,message:"gagal",data:err});
            })
        }).catch((err)=>{
            console.log("PR",err);
            res.status(500).json({status:500,message:"gagal",data:err});
        });
    }

    static async acceptPO (req,res){
        const {PRId,statusPR} = req.body;
        let db = await PO.findAll();
        let acak = moment().format(`ddYYMMDhhmmssms`);
        let nomorPO = `PO${acak}${db.length}`;

        PR.findAll({where:{id:PRId,statusPR:0}}).then(async(data)=>{
            if(data.length==0){
                res.status(200).json({status:200,message:"data tidak ada"});
            }else{
                let subPR = await sq.query(`select sp.id,sp."jumlahSubPR" as "jumlah",sp."hargaBelisubPR" as "hargaBeli",sp."totalHargaPerBarangsubPR" as "totalHargaPerBarang",sp."masterBarangId" from "subPR" sp where sp."deletedAt" isnull and sp."PRId" = '${PRId}'`);
                let mCC = await sq.query(`select * from "poCC" pc where pc."deletedAt" isnull and pc."PRId" = '${PRId}'`);
                PO.findAll({where:{nomorPO}}).then((data2)=>{
                    if(data2.length){
                        res.status(200).json({status:200,message:"NomorPO sudah ada"});
                    }else{
                        const idPO = uuid_v4();
                        PO.create({id:idPO,nomorPO,tanggalPO:data[0].tanggalPR,rencanaTglKedatangan:data[0].rencanaTglKedatanganPR,masterSupplierId:data[0].masterSupplierId,pembayaran:data[0].pembayaranPR,TOP:data[0].TOPPR,metodePengiriman:data[0].metodePengirimanPR,totalHarga:data[0].totalHargaPR,keterangan:data[0].keteranganPR,PPN:data[0].PPNPR,promo:data[0].promoPR,rev:data[0].revPR,PRId}).then((data3)=>{
                            for (let i = 0; i < subPR[0].length; i++) {
                                subPR[0][i].id=uuid_v4();
                                subPR[0][i].POId=idPO
                            }
                            subPO.bulkCreate(subPR[0]).then((data4)=>{
                                for (let j = 0; j < mCC[0].length; j++) {
                                    mCC[0][j].POId=idPO;
                                }
                                CC.bulkCreate(mCC[0],{updateOnDuplicate:["POId"]}).then((data5)=>{
                                    PR.update({statusPR},{where:{id:PRId}}).then((data6)=>{
                                        res.status(200).json({status:200,message:"sukses"});
                                    }).catch((err)=>{
                                        console.log("PR-Update",err);
                                        res.status(500).json({status:500,message:"gagal",data:err}); 
                                    });
                                }).catch((err)=>{
                                    console.log("CC-Bulk",err);
                                    res.status(500).json({status:500,message:"gagal",data:err}); 
                                });
                            }).catch((err)=>{
                                console.log("subPO-Bulk",err);
                                res.status(500).json({status:500,message:"gagal",data:err});            
                            });
                        }).catch((err)=>{
                            console.log("PO-create",err);
                            res.status(500).json({status:500,message:"gagal",data:err});        
                        });
                    }
                }).catch((err)=>{
                    console.log("PO-find-all",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                });
            }
        }).catch((err)=>{
            console.log("PR-find-all",err);
            res.status(500).json({status:500,message:"gagal",data:err});
        });
    }
    
    static async list (req,res){
        let data =  await sq.query(`select distinct p.id as "idPR",p."nomorPR",p."tanggalPR",p."pembayaranPR",p."TOPPR",p."metodePengirimanPR",p."keteranganPR",p."PPNPR",p."promoPR",p."masterSupplierId",ms."namaSupplier",p."totalHargaPR",p."rencanaTglKedatanganPR",p."masterDivisiId",md."namaDivisi",sum(sp."jumlahSubPR")as "totalBarangPR",p."statusPR",p."createdAt",p."deletedAt" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterSupplier" ms on ms.id = p."masterSupplierId" join "masterDivisi" md on md.id = p."masterDivisiId" where sp."deletedAt" isnull and p."deletedAt" isnull and ms."deletedAt" isnull and md."deletedAt" isnull group by p.id,sp."PRId" ,ms."namaSupplier",md."namaDivisi" order by p."createdAt"`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }

    static async listCCbyNoPR(req,res){
        const {nomorPR}=req.params;
        // let data = await sq.query(`select pc.id as "poCCId",* from "poCC" pc join "PR" p on p.id = pc."PRId" where p."deletedAt" isnull and pc."deletedAt" isnull and p."nomorPR" = '${nomorPR}'`)
        let data =  await sq.query(`select pc.id as "poCCId",pc.email,pc."POId",pc."PRId",p."nomorPR" from "poCC" pc join "PR" p on p.id = pc."PRId" where p."deletedAt" isnull and pc."deletedAt" isnull and p."nomorPR" = '${nomorPR}'`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }

    static async listBarangByNoPR(req,res){
        const {nomorPR}=req.params;
        let data =  await sq.query(`select sp.id as "subPRID",sp."jumlahSubPR",sp."hargaBelisubPR",sp."totalHargaPerBarangsubPR",sp."PRId",p."nomorPR",p."createdAt" as "tglPembuatanPR",sp."masterBarangId",mb."namaBarang",mb."masterKategoriBarangId",mkb."namaKategori",sp."createdAt", sp."deletedAt",sp."updatedAt" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterBarang" mb on mb.id = sp."masterBarangId" join "masterKategoriBarang" mkb on mkb.id = mb."masterKategoriBarangId" where sp."deletedAt" isnull and mb."deletedAt" isnull and mkb."deletedAt" isnull and p."nomorPR" = '${nomorPR}' order by sp."createdAt" `);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }

    static async listByStatusPR(req,res){
        const {statusPR}=req.params;
        let data = await sq.query(`select distinct p.id as "idPR",p."nomorPR",p."tanggalPR",p."pembayaranPR",p."TOPPR",p."metodePengirimanPR",p."keteranganPR",p."PPNPR",p."promoPR",p."masterSupplierId",ms."namaSupplier",p."totalHargaPR",p."rencanaTglKedatanganPR",p."masterDivisiId",md."namaDivisi",sum(sp."jumlahSubPR")as "totalBarangPR" ,p."createdAt",p."deletedAt" from "subPR" sp join "PR" p on p.id = sp."PRId" join "masterSupplier" ms on ms.id = p."masterSupplierId" join "masterDivisi" md on md.id = p."masterDivisiId" where sp."deletedAt" isnull and p."deletedAt" isnull and ms."deletedAt" isnull and md."deletedAt" isnull and p."statusPR" = '${statusPR}' group by p.id,sp."PRId" ,ms."namaSupplier",md."namaDivisi" order by p."createdAt"`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }
}

module.exports = Controller;

