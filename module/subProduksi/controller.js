const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const stock = require("../stock/model");
const subProduksiM = require("./model");
const masterBarang = require("../masterBarang/model");
const moment = require("moment");

class Controller {
  static async list(req, res) {
    // let data = await sq.query(`select sp.id as "subProduksiId", sp."jumlahBahanProduksi" ,sp."createdAt" ,sp."updatedAt" ,sp."deletedAt" ,sp."produksiId" , sp."masterBarangId" ,mb."namaBarang", sp."masterUserId" ,mu.nama as "namaUser",s.id as "stockId" , s."jumlahStock" from "subProduksi" sp join "masterBarang" mb on mb.id = sp."masterBarangId" join "masterUser" mu on mu.id = sp."masterUserId" join stock s on s."masterBarangId" = sp."masterBarangId" where sp."deletedAt" isnull and mb."deletedAt" isnull and mu."deletedAt" isnull and s."deletedAt" isnull`);
    // let data = await sq.query(`select sp.id as "subProduksiId", sp."jumlahBahanProduksi", sp."produksiId",p."kodeBatch",p."kodeProduksi",sp."masterBarangId",mb."namaBarang",sp."stockId",s."batchNumber",sp."masterUserId",mu.nama,mu."NIP",sp."PICSubProduksi",sp."tanggalKeluarSubProduksi" ,sp."createdAt" ,sp."deletedAt" from "subProduksi" sp join "masterBarang" mb on mb.id = sp."masterBarangId" join produksi p on p.id = sp."produksiId" join stock s on s.id = sp."stockId" join "masterUser" mu on mu.id = sp."masterUserId" where sp."deletedAt" isnull and mb."deletedAt" isnull and p."deletedAt" isnull and s."deletedAt" isnull and mu."deletedAt" isnull order by sp."createdAt"`)
    let data = await sq.query(`select sp."produksiId" ,p."kodeProduksi",sp."tanggalKeluarSubProduksi", sp."PICSubProduksi" from "subProduksi" sp join produksi p on p.id = sp."produksiId" where sp."deletedAt" isnull and p."deletedAt" isnull group by sp."tanggalKeluarSubProduksi",sp."PICSubProduksi",sp."produksiId" ,p."kodeProduksi",sp."createdAt" order by sp."tanggalKeluarSubProduksi", sp."createdAt"`);
    let barang = await sq.query(`select * from "subProduksi" sp join stock s on s.id = sp."stockId" join "masterBarang" mb on mb.id = sp."masterBarangId" where sp."deletedAt" isnull and s."deletedAt" isnull and mb."deletedAt" isnull order by sp."createdAt"`);
    for (let i = 0; i < data[0].length; i++) {
      data[0][i].bulk =[];
      for (let j = 0; j < barang[0].length; j++) {
       if(moment(data[0][i].tanggalKeluarSubProduksi).format()==moment(barang[0][j].tanggalKeluarSubProduksi).format()){
          if(data[0][i].produksiId==barang[0][j].produksiId){
          let x ={};
           x.subProduksiId=barang[0][j].id;
           x.masterBarangId=barang[0][j].masterBarangId;
           x.namaBarang=barang[0][j].namaBarang;
           x.batchNumber=barang[0][j].batchNumber;
           x.stockId=barang[0][j].stockId;
           x.masterUserId=barang[0][j].masterUserId;
           x.jumlahBahanProduksi=barang[0][j].jumlahBahanProduksi;
           data[0][i].bulk.push(x);
        }
       }
      }
    }
    // console.log(barang[0]);
    // console.log(data[0]);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listSubProduksiByProduksiId(req, res) {
    let { pId,tglKeluar } = req.body;
    // console.log(req.body);
    // let data = await sq.query(`select sp.id as "subProduksiId", sp."jumlahBahanProduksi", sp."produksiId",p."kodeBatch",p."kodeProduksi",sp."masterBarangId",mb."namaBarang",sp."stockId",s."batchNumber",sp."masterUserId",mu.nama,mu."NIP",sp."PICSubProduksi",sp."tanggalKeluarSubProduksi" ,sp."createdAt" ,sp."deletedAt" from "subProduksi" sp join "masterBarang" mb on mb.id = sp."masterBarangId" join produksi p on p.id = sp."produksiId" join stock s on s.id = sp."stockId" join "masterUser" mu on mu.id = sp."masterUserId" where sp."deletedAt" isnull and mb."deletedAt" isnull and p."deletedAt" isnull and s."deletedAt" isnull and mu."deletedAt" isnull and sp."produksiId" = '${produksiId}' and sp."tanggalKeluarSubProduksi" ='${tglKeluar}' order by sp."createdAt"`);
    // let data = await sq.query(`select sp.id as "subProduksiId", sp."jumlahBahanProduksi", sp."produksiId",p."kodeProduksi",sp."masterBarangId",mb."namaBarang",sp."stockId",s."batchNumber",sp."masterUserId",mu.nama,mu."NIP",sp."PICSubProduksi",sp."tanggalKeluarSubProduksi" ,sp."createdAt" ,sp."deletedAt" from "subProduksi" sp join "masterBarang" mb on mb.id = sp."masterBarangId" join produksi p on p.id = sp."produksiId" join stock s on s.id = sp."stockId" join "masterUser" mu on mu.id = sp."masterUserId" where sp."deletedAt" isnull and mb."deletedAt" isnull and p."deletedAt" isnull and s."deletedAt" isnull and mu."deletedAt" isnull and sp."produksiId" = '${pId}' and sp."tanggalKeluarSubProduksi"= '${moment(tglKeluar).format()}'  order by sp."createdAt"`);
    let data = await sq.query(`select sp.id as "subProduksiId", sp."jumlahBahanProduksi", sp."produksiId",p."kodeProduksi",sp."masterBarangId",mb."namaBarang",sp."stockId",s."batchNumber",sp."masterUserId",mu.nama,mu."NIP",sp."PICSubProduksi",sp."tanggalKeluarSubProduksi" ,sp."createdAt" ,sp."deletedAt" from "subProduksi" sp join "masterBarang" mb on mb.id = sp."masterBarangId" join produksi p on p.id = sp."produksiId" join stock s on s.id = sp."stockId" join "masterUser" mu on mu.id = sp."masterUserId" where sp."deletedAt" isnull and mb."deletedAt" isnull and p."deletedAt" isnull and s."deletedAt" isnull and mu."deletedAt" isnull and sp."produksiId" = '${pId}' and sp."tanggalKeluarSubProduksi" ='${tglKeluar}' order by sp."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async detailsById(req, res) {
    const { spId } = req.params;
    // let data = await sq.query(`select sp.id as "subProduksiId", sp."jumlahBahanProduksi" ,sp."createdAt" ,sp."updatedAt" ,sp."deletedAt" ,sp."produksiId" , sp."masterBarangId" ,mb."namaBarang", sp."masterUserId" ,mu.nama as "namaUser" ,sp."stockId",s."batchNumber", s."jumlahStock" from "subProduksi" sp join "masterBarang" mb on mb.id = sp."masterBarangId" join "masterUser" mu on mu.id = sp."masterUserId" join stock s on s."masterBarangId" = sp."masterBarangId" where sp."deletedAt" isnull and mb."deletedAt" isnull and mu."deletedAt" isnull and s."deletedAt" isnull and sp.id = '${id}'`);
    let data = await sq.query(`select sp.id as "subProduksiId",sp."jumlahBahanProduksi",sp."produksiId",p."kodeBatch",p."kodeProduksi",p."tanggalProduksi",p."jumlahProduksi",p."realisasiJumlahProduksi",p."formulaId",f."keteranganFormula",sp."masterBarangId",mb."namaBarang",sp."stockId",s."batchNumber",s."tanggalKadaluarsa",s."hargaBeliSatuanStock",s."gudangId",g."namaGudang",g."kodeGudang" ,sp."masterUserId",mu.nama,mu."NIP",sp."PICSubProduksi",sp."tanggalKeluarSubProduksi",sp."createdAt" ,sp."deletedAt" from "subProduksi" sp join "masterBarang" mb on mb.id = sp."masterBarangId" join produksi p on p.id = sp."produksiId" join formula f on f.id = p."formulaId" join stock s on s.id = sp."stockId" join gudang g on g.id = s."gudangId" join "masterUser" mu on mu.id = sp."masterUserId" where sp."deletedAt" isnull and mb."deletedAt" isnull and p."deletedAt" isnull and s."deletedAt" isnull and mu."deletedAt" isnull and f."deletedAt" isnull and g."deletedAt" isnull and sp.id = '${spId}' order by sp."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async register(req,res){
    let {produksiId,tanggalKeluarSubProduksi,PICSubProduksi,masterUserId,bulkSubProduksi}=req.body;
    if(!masterUserId){
      masterUserId = req.dataUsers.id;
    }
    let mBarang = ``;
    let mData = ``;
    for (let i = 1; i < bulkSubProduksi.length; i++) {
      mData+=` or s."masterBarangId" = '${bulkSubProduksi[i].masterBarangId}' and s."batchNumber" ='${bulkSubProduksi[i].kodeBatch}'`;
      mBarang+=` or mb.id='${bulkSubProduksi[i].masterBarangId}'`;
    }
    let data = await sq.query(`select *,(select mb."namaBarang" from "masterBarang" mb where mb.id = s."masterBarangId") from stock s where s."deletedAt" isnull and (s."masterBarangId" = '${bulkSubProduksi[0].masterBarangId}' and s."batchNumber" ='${bulkSubProduksi[0].kodeBatch}'${mData})`);
    let barang = await sq.query(`select * from "masterBarang" mb where mb."deletedAt" isnull and mb.id='${bulkSubProduksi[0].masterBarangId}'${mBarang}`);

    if(data[0].length==0){
      res.status(200).json({status:200,message:"stock tidak ada"});
    }else{
      let cekBarang = false;
      let tmpBarang = [];

      for (let j = 0; j < bulkSubProduksi.length; j++) {
        for (let k = 0; k < barang[0].length; k++) {
          if(bulkSubProduksi[j].masterBarangId == barang[0][k].id){
            if(bulkSubProduksi[j].jumlahBahanProduksi > barang[0][k].jumlahTotalBarang){
              cekBarang = true;
              tmpBarang.push({namaBarang:barang[0][k].namaBarang,jumlahTotalBarang:barang[0][k].jumlahTotalBarang,jumlahBahanProduksi:bulkSubProduksi[j].jumlahBahanProduksi});
            }
          }
        }
      }
      if(cekBarang){
        res.status(200).json({status:200,message:"booked",data:tmpBarang});
      }
      else{
        let cek = false;
        let tBarang = [];
        let bulkStock = [];

        for (let j = 0; j < bulkSubProduksi.length; j++) {
          for (let k = 0; k < data[0].length; k++) {
            if(data[0][k].masterBarangId==bulkSubProduksi[j].masterBarangId){
              if(bulkSubProduksi[j].jumlahBahanProduksi>data[0][k].jumlahStock){
                tBarang.push({nama:data[0][j].namaBarang, jmlStock:data[0][j].jumlahStock, jmlBahanProduksi:bulkSubProduksi[k].jumlahBahanProduksi});
                cek = true;
              }
              bulkStock.push({id:data[0][k].id,namaBarang:data[0][k].namaBarang,jumlahStock:data[0][k].jumlahStock-bulkSubProduksi[j].jumlahBahanProduksi})
              bulkSubProduksi[j].id = uuid_v4();
              bulkSubProduksi[j].produksiId=produksiId;
              bulkSubProduksi[j].tanggalKeluarSubProduksi= tanggalKeluarSubProduksi;
              bulkSubProduksi[j].PICSubProduksi=PICSubProduksi;
              bulkSubProduksi[j].masterUserId=masterUserId;
              bulkSubProduksi[j].stockId=data[0][k].id;
            }
          }
        }
        if(cek){
          res.status(200).json({status:200,message:"stock tidak cukup",data:tBarang});
        }else{
          subProduksiM.bulkCreate(bulkSubProduksi).then((data2)=>{
            stock.bulkCreate(bulkStock,{updateOnDuplicate:['jumlahStock']}).then((data3)=>{
              for (let l = 0; l < barang[0].length; l++) {
                for (let m = 0; m < bulkSubProduksi.length; m++) {
                  if(barang[0][l].id==bulkSubProduksi[m].masterBarangId){
                    barang[0][l].jumlahTotalBarang-=bulkSubProduksi[m].jumlahBahanProduksi
                  }
                }
              }
              masterBarang.bulkCreate(barang[0],{updateOnDuplicate:["jumlahTotalBarang"]}).then((data4)=>{
                res.status(200).json({status:200,message:"sukses"});
              }).catch((err)=>{
                console.log("MB");
                res.status(500).json({ status: 500, message: "gagal", data: err });
              });
            }).catch((err)=>{
            console.log("STOCK");
            res.status(500).json({ status: 500, message: "gagal", data: err });
            });
          }).catch((err)=>{
            console.log("SUB");
            res.status(500).json({ status: 500, message: "gagal", data: err });
          });
        }
      }
    }
  }

  static update (req,res){
    let {produksiId,tanggalKeluarSubProduksi,PICSubProduksi,masterUserId,bulkSubProduksi}=req.body;
    if(!masterUserId){
      masterUserId = req.dataUsers.id;
    }
    subProduksiM.findAll(({where:{produksiId,tanggalKeluarSubProduksi},raw:true})).then(async(data)=>{
      if(data.length==0){
        res.status(200).json({status:200,message:"data tidak ada"});
      }else{
        let cekBarang = false;
        let cekStok = false;
        let stIsi = ``;
        let bIsi=``;
        let mStok=[];
        let idStock=[];
        let mBarang=[];
        let sBarang=[];
        let sStok=[];
       
        for (let i = 0; i < data.length; i++) {
          if(i>0){
            stIsi+= ` or s.id='${data[i].stockId}'`;
          }
          idStock.push(data[i].id)
        }
        for (let j = 1; j < bulkSubProduksi.length; j++) {
          bIsi+=` or s."masterBarangId" = '${bulkSubProduksi[j].masterBarangId}' and s."batchNumber" = '${bulkSubProduksi[j].kodeBatch}'`;
        }
        let mStock = await sq.query(`select s.id as "stockId", * from stock s join "masterBarang" mb on mb.id = s."masterBarangId" where s."deletedAt" isnull and s."deletedAt" isnull and s.id = '${data[0].stockId}'${stIsi}`);
        let bStock = await sq.query(`select s.id as "stockId", * from stock s join "masterBarang" mb on mb.id = s."masterBarangId" where s."deletedAt" isnull and s."deletedAt" isnull and s."masterBarangId" = '${bulkSubProduksi[0].masterBarangId}' and s."batchNumber" = '${bulkSubProduksi[0].kodeBatch}'${bIsi}`);
        let allStock = [...mStock[0],...bStock[0]];
        let tmp = [...new Map(allStock.map(item => [item['stockId'], item])).values()];
        
        for (let k = 0; k < tmp.length; k++) {
          for (let l = 0; l < data.length; l++) {
            if(tmp[k].stockId==data[l].stockId && tmp[k].masterBarangId==data[l].masterBarangId){
              tmp[k].jumlahStock+=data[l].jumlahBahanProduksi;
              tmp[k].jumlahTotalBarang+=data[l].jumlahBahanProduksi;
            }
          }
          for (let m = 0; m < bulkSubProduksi.length; m++) {
            if(tmp[k].masterBarangId == bulkSubProduksi[m].masterBarangId && tmp[k].batchNumber == bulkSubProduksi[m].kodeBatch){
              if(tmp[k].jumlahTotalBarang < bulkSubProduksi[m].jumlahBahanProduksi){
                cekBarang=true;
                sBarang.push({namaBarang:tmp[k].namaBarang,jumlahTotalBarang:tmp[k].jumlahTotalBarang,jumlahBahanProduksi:bulkSubProduksi[m].jumlahBahanProduksi});
              }
              if(tmp[k].jumlahStock < bulkSubProduksi[m].jumlahBahanProduksi){
                cekStok=true;
                sStok.push({namaBarang:tmp[k].namaBarang,jumlahStock:tmp[k].jumlahStock,jumlahBahanProduksi:bulkSubProduksi[m].jumlahBahanProduksi});
              }
              tmp[k].jumlahStock-=bulkSubProduksi[m].jumlahBahanProduksi;
              tmp[k].jumlahTotalBarang-=bulkSubProduksi[m].jumlahBahanProduksi;
              bulkSubProduksi[m].id=uuid_v4();
              bulkSubProduksi[m].PICSubProduksi=PICSubProduksi;
              bulkSubProduksi[m].tanggalKeluarSubProduksi=tanggalKeluarSubProduksi;
              bulkSubProduksi[m].produksiId=produksiId;
              bulkSubProduksi[m].stockId=tmp[k].stockId;
              bulkSubProduksi[m].masterUserId=masterUserId;
            }
          }
          mStok.push({id:tmp[k].stockId,batchNumber:tmp[k].batchNumber,jumlahStock:tmp[k].jumlahStock});
          mBarang.push({id:tmp[k].masterBarangId,namaBarang:tmp[k].namaBarang,jumlahTotalBarang:tmp[k].jumlahTotalBarang});
        }
        // console.log("===========tmp==============");
        // console.log(tmp);
        // console.log("===========mstok==============");
        // console.log(mStok);
        // console.log("===========mBarang==============");
        // console.log(mBarang);
        
        if(cekBarang){
          res.status(200).json({status:200,message:"booked",data:sBarang});
        }else{
          if(cekStok){
            res.status(200).json({status:200,message:"stock tidak cukup",data:sStok});
          }else{
            subProduksiM.destroy({where:{id:idStock}}).then((data2)=>{
              subProduksiM.bulkCreate(bulkSubProduksi).then((data3)=>{
                stock.bulkCreate(mStok,{updateOnDuplicate:["jumlahStock"]}).then((data4)=>{
                  masterBarang.bulkCreate(mBarang,{updateOnDuplicate:["jumlahTotalBarang"]}).then((data5)=>{
                    res.status(200).json({status:200,message:"sukses"})
                  }).catch((err)=>{
                    console.log("MB",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                  });
                }).catch((err)=>{
                  console.log("stock",err);
                  res.status(500).json({status:500,message:"gagal",data:err});
                });
              }).catch((err)=>{
                console.log("sub-Bulk",err);
                res.status(500).json({status:500,message:"gagal",data:err});
              })
            }).catch((err)=>{
              console.log("destroy",err);
              res.status(500).json({status:500,message:"gagal",data:err});
            });
          }
        }
      }
    });
  }
  
  static async delete(req,res){
    const {spId} = req.body;
    // let cekSub = await sq.query(`select * from "subProduksi" sp where sp."deletedAt" isnull and sp.id = '${spId}'`);
    subProduksiM.findAll({where:{id:spId}}).then(async(data)=>{
      let mStock = await sq.query(`select *,(select mb."namaBarang" from "masterBarang" mb where mb.id = s."masterBarangId") from stock s where s."deletedAt" isnull and s.id ='${data[0].stockId}'`);
      let barang = await sq.query(`select * from "masterBarang" mb where mb."deletedAt" isnull and mb.id='${data[0].masterBarangId}'`);
      subProduksiM.destroy({where:{id:spId}}).then((data2)=>{
        let hasilS = mStock[0][0].jumlahStock + data[0].jumlahBahanProduksi;
        stock.update({jumlahStock:hasilS},{where:{id:mStock[0][0].id}}).then((data3)=>{
          let hasilB = barang[0][0].jumlahTotalBarang + data[0].jumlahBahanProduksi;
          masterBarang.update({jumlahTotalBarang:hasilB},{where:{id:barang[0][0].id}}).then((data4)=>{
            res.status(200).json({ status: 200, message: "sukses" });
          }).catch((err)=>{
            console.log("MB");
            res.status(500).json({ status: 500, message: "gagal", data: err });
          });
        }).catch((err)=>{
          console.log("STOCK");
          res.status(500).json({ status: 500, message: "gagal", data: err });
        });
      }).catch((err)=>{
        console.log("SUB");
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
    }).catch((err)=>{
      console.log("F-sub");
      res.status(500).json({ status: 500, message: "data tidak ada", data: err });
    });
  }

  static async deleteAll(req,res){
    const {pId,tglKeluar}=req.body;
    // console.log(req.body);
    // let data = await sq.query(`select sp.id as "subProduksiId",* from "subProduksi" sp join produksi p on p.id = sp."produksiId" join stock s on s.id = sp."stockId" join "masterBarang" mb on mb.id = sp."masterBarangId" where sp."deletedAt" isnull and p."deletedAt" isnull and s."deletedAt" isnull and sp."produksiId" = '${pId}' and sp."tanggalKeluarSubProduksi" = '${moment(tglKeluar).format()}'`)
    let data = await sq.query(`select sp.id as "subProduksiId",* from "subProduksi" sp join produksi p on p.id = sp."produksiId" join stock s on s.id = sp."stockId" join "masterBarang" mb on mb.id = sp."masterBarangId" where sp."deletedAt" isnull and p."deletedAt" isnull and s."deletedAt" isnull and sp."produksiId" = '${pId}' and sp."tanggalKeluarSubProduksi" = '${tglKeluar}'`)
    if(data[0].length==0){
      res.status(200).json({status:200,message:"data tidak ada"});
    }else{
    let subId =[];
    let mBarang =[];
    let mStock =[];
    for (let i = 0; i < data[0].length; i++) {
      subId.push(data[0][i].subProduksiId);
      mBarang.push({id:data[0][i].masterBarangId,namaBarang:data[0][i].namaBarang,jumlahTotalBarang:data[0][i].jumlahTotalBarang+data[0][i].jumlahBahanProduksi});
      mStock.push({id:data[0][i].stockId,batchNumber:data[0][i].batchNumber,jumlahStock:data[0][i].jumlahStock+data[0][i].jumlahBahanProduksi});
    }
    subProduksiM.destroy({where:{id:subId}}).then((data2)=>{
      stock.bulkCreate(mStock,{updateOnDuplicate:["jumlahStock"]}).then((data3)=>{
        masterBarang.bulkCreate(mBarang,{updateOnDuplicate:["jumlahTotalBarang"]}).then((data4)=>{
          res.status(200).json({status:200,message:"sukses"});
        }).catch((err)=>{
          console.log("Stock",err);
          res.status(500).json({status:200,message:"gagal"});
        });
      }).catch((err)=>{
        console.log("Stock",err);
        res.status(500).json({status:200,message:"gagal"});
      });
    }).catch((err)=>{
      console.log("destroy",err);
      res.status(500).json({status:200,message:"gagal"});
    });
    // console.log(data[0]);
    // console.log("===========S==============");
    // console.log(subId);
    // console.log("===========mB==============");
    // console.log(mBarang);
    // console.log("===========mS==============");
    // console.log(mStock);
    }
  }
}
module.exports = Controller;

// static async listSubProduksiBykodeBatch(req,res){
//   const {kodeBatch} = req.body;
//   let data = await sq.query(`select sp.id as "subProduksiId", sp."jumlahBahanProduksi", sp."produksiId",p."kodeBatch",p."kodeProduksi",sp."masterBarangId",mb."namaBarang",sp."stockId",s."batchNumber",sp."masterUserId",mu.nama,mu."NIP", sp."createdAt" ,sp."deletedAt" from "subProduksi" sp join "masterBarang" mb on mb.id = sp."masterBarangId" join produksi p on p.id = sp."produksiId" join stock s on s.id = sp."stockId" join "masterUser" mu on mu.id = sp."masterUserId" where sp."deletedAt" isnull and mb."deletedAt" isnull and p."deletedAt" isnull and s."deletedAt" isnull and mu."deletedAt" isnull and p."kodeBatch" = '${kodeBatch}' order by sp."createdAt"`);
//   for (let i = 0; i < data[0].length; i++) {
//     if(data[0][i].jumlahBahanProduksi<0){
//       data[0][i].jumlahBahanProduksi *=-1
//     }
//   }
//   res.status(200).json({ status: 200, message: "sukses", data: data[0] });
// }

// static async register(req, res) {
  //   let {produksiId,masterBarangId,masterUserId,jumlahBahanProduksi,batchNumber,} = req.body;
  //   if (!masterUserId) {
  //     masterUserId = req.dataUsers.id;
  //   }
  //   let data = await sq.query(`select *,(select mb."namaBarang" from "masterBarang" mb where mb.id = s."masterBarangId") from stock s where s."deletedAt" isnull and s."masterBarangId" = '${masterBarangId}' and s."batchNumber" ='${batchNumber}'`);
  //   let barang = await sq.query(`select * from "masterBarang" mb where mb."deletedAt" isnull and mb.id='${masterBarangId}'`);
  //   // console.log(data[0]);
  //   // console.log(barang[0]);
  //   if (data[0].length) {
  //     if (data[0][0].jumlahStock > jumlahBahanProduksi) {
  //       subProduksiM.create({id: uuid_v4(),jumlahBahanProduksi,produksiId,stockId: data[0][0].id,masterBarangId,masterUserId})
  //         .then((data2) => {
  //           let hasil = data[0][0].jumlahStock - jumlahBahanProduksi;
  //           stock
  //             .update(
  //               { jumlahStock: hasil },
  //               { where: { masterBarangId, batchNumber } }
  //             )
  //             .then((data3) => {
  //               let totBarang =
  //                 barang[0][0].jumlahTotalBarang - jumlahBahanProduksi;
  //               masterBarang
  //                 .update(
  //                   { jumlahTotalBarang: totBarang },
  //                   { where: { id: barang[0][0].id } }
  //                 )
  //                 .then((data4) => {
  //                   res.status(200).json({ status: 200, message: "sukses" });
  //                 })
  //                 .catch((err) => {
  //                   console.log("gagal MB");
  //                   res
  //                     .status(500)
  //                     .json({ status: 500, message: "gagal", data: err });
  //                 });
  //             })
  //             .catch((err) => {
  //               console.log("gagal S");
  //               res
  //                 .status(500)
  //                 .json({ status: 500, message: "gagal", data: err });
  //             });
  //         })
  //         .catch((err) => {
  //           console.log("gagal Sub");
  //           res.status(500).json({ status: 500, message: "gagal", data: err });
  //         });
  //     } else {
  //       let barang = [
  //         {
  //           namaBarang: data[0][0].namaBarang,
  //           stock: data[0][0].jumlahStock,
  //           jumlahBahanProduksi,
  //         },
  //       ];
  //       res
  //         .status(200)
  //         .json({ status: 200, message: "Stock tidak cukup", data: barang });
  //     }
  //   } else {
  //     res.status(200).json({ status: 200, message: "Barang tidak ada" });
  //   }
  // }

  // static async update(req, res) {
  //   const {subProduksiId,produksiId,masterBarangId,masterUserId,jumlahBahanProduksi,stockId} = req.body;
  //   let sub = await sq.query(`select * from "subProduksi" sp where sp."deletedAt" isnull and sp.id ='${subProduksiId}'`);
  //   let data = await sq.query(`select *,(select mb."namaBarang" from "masterBarang" mb where mb.id = s."masterBarangId") from stock s where s."deletedAt" isnull and s.id ='${stockId}'`);
  //   let barang = await sq.query(`select * from "masterBarang" mb where mb."deletedAt" isnull and mb.id='${masterBarangId}'`);
  //   let totalStock = data[0][0].jumlahStock - sub[0][0].jumlahBahanProduksi;
  //   // console.log(data[0]);
  //   // console.log("==========B=========");
  //   // console.log(barang[0]);
  //   // console.log("==========S=========");
  //   // console.log(sub[0]);
  //   // console.log("==========T=========");
  //   // console.log(totalStock);

  //   if (!masterUserId) {
  //     masterUserId = req.dataUsers.id;
  //   }
  //   if (totalStock < jumlahBahanProduksi) {
  //     let barang = {
  //       namaBarang: data[0][0].namaBarang,
  //       jumlahStock: totalStock,
  //       jumlahBahan: jumlahBahanProduksi,
  //     };
  //     res
  //       .status(200)
  //       .json({ status: 200, message: "Stock tidak cukup", data: barang });
  //   } else {
  //     let hasil = sub[0][0].jumlahBahanProduksi + jumlahBahanProduksi;
  //     //  console.log(hasil);
  //     subProduksiM
  //       .update(
  //         {
  //           jumlahBahanProduksi: jumlahBahanProduksi * -1,
  //           produksiId,
  //           masterBarangId,
  //           masterUserId,
  //           stockId,
  //         },
  //         { where: { id: subProduksiId } }
  //       )
  //       .then((data2) => {
  //         stock
  //           .update(
  //             { jumlahStock: data[0][0].jumlahStock - hasil },
  //             { where: { id: stockId } }
  //           )
  //           .then((data3) => {
  //             masterBarang
  //               .update(
  //                 { jumlahTotalBarang: barang[0][0].jumlahTotalBarang - hasil },
  //                 { where: { id: masterBarangId } }
  //               )
  //               .then((data4) => {
  //                 res.status(200).json({ status: 200, message: "sukses" });
  //               })
  //               .catch((err) => {
  //                 console.log("gagal MB");
  //                 res
  //                   .status(500)
  //                   .json({ status: 500, message: "gagal", data: err });
  //               });
  //           })
  //           .catch((err) => {
  //             console.log("gagal S");
  //             res
  //               .status(500)
  //               .json({ status: 500, message: "gagal", data: err });
  //           });
  //       })
  //       .catch((err) => {
  //         console.log("gagal Sub");
  //         res.status(500).json({ status: 500, message: "gagal", data: err });
  //       });
  //   }
  // }