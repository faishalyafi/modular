const transaksiOP = require("./model");
const subTransaksiOP = require("../subTransaksiOP/model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const moment = require("moment");
const stock = require("../stock/model");
const masterBarang = require("../masterBarang/model");

class Controller {
  static async generateNoDO(req, res) {
    let db = await transaksiOP.findAll();
    let acak = moment().format(`ddYYMMDhhmmssms`);
    let nomorDO = `DO${acak}${db.length}`;
    res.status(200).json({ staus: 200, message: "sukses", nomorDO: nomorDO });
  }

  static register(req,res){
    let {namaPengirimOP,tanggalPengirimanOP,nomorDO,OPId,masterUserId,statusTransaksiOP,bulkBarangOP} = req.body;
    let sub = JSON.parse(JSON.stringify(bulkBarangOP));
    const idTrans = uuid_v4();
    if(!masterUserId){
      masterUserId = req.dataUsers.id;
    }
    transaksiOP.findAll({where:{nomorDO}}).then(async(data)=>{
      if(data.length){
        res.status(200).json({status:200,message:"nomorDO sudah ada"});
      }else{
        let isi="";
        let isiBarang="";
        let cek = false;
        let cekBonus = false;
        let cekBarang =[];
        let cekStock = [];
        let bonus =[];

        for (let i = 1; i < sub.length; i++) {
            isi+=` or mb.id = '${sub[i].masterBarangId}'`;
            isiBarang+=` or s."masterBarangId" = '${sub[i].masterBarangId}'`;
        }
        let mstok = await sq.query(`select sum(s."jumlahStock") as "total", mb."namaBarang", s."masterBarangId",mb."jumlahTotalBarang" from stock s join "masterBarang" mb on mb.id = s."masterBarangId" where s."deletedAt" isnull and mb."deletedAt" isnull and mb.id = '${sub[0].masterBarangId}'${isi} group by s."masterBarangId", mb."namaBarang",mb."jumlahTotalBarang"`);
        
        for (let j = 0; j < sub.length; j++) {
          for (let k = 0; k < mstok[0].length; k++) {
            if(sub[j].masterBarangId==mstok[0][k].masterBarangId){
              if(sub[j].jumlahBarangOP>mstok[0][k].total){
                cek=true;
                cekStock.push({namaBarang:mstok[0][k].namaBarang,stock:mstok[0][k].total,order:sub[j].jumlahBarangOP});
              }
              if(sub[j].isBonus){
                bonus.push({id:sub[j].masterBarangId,namaBarang:mstok[0][k].namaBarang,jumlahTotalBarang:mstok[0][k].jumlahTotalBarang-sub[j].jumlahBarangOP});
                if(mstok[0][k].jumlahTotalBarang < sub[j].jumlahBarangOP){
                  cekBonus=true;
                  cekBarang.push({namaBarang:mstok[0][k].namaBarang,jumlahTotalBarang:mstok[0][k].jumlahTotalBarang,barangBonus:sub[j].jumlahBarangOP});
                }
              }
            }
          }
        }
      
        if(cek){
          res.status(200).json({status:200,message:"stock tidak cukup",data:cekStock});
        }else{
          if(cekBonus){
            res.status(200).json({status:200,message:"bonus boked",data:cekBarang});
          }else{
            transaksiOP.create({id: idTrans,namaPengirimOP,tanggalPengirimanOP,nomorDO,OPId,masterUserId,statusTransaksiOP}).then(async(data2)=>{
              let hasil=[];
              let bStock = await sq.query(`select * from stock s where s."deletedAt" isnull and s."jumlahStock" > 0 and s."masterBarangId" = '${sub[0].masterBarangId}'${isiBarang} order by s."tanggalKadaluarsa", s."createdAt"`);
              // console.log(bStock[0]);
              // console.log("==========================");
              for (let l = 0; l < sub.length; l++) {
                for (let m = 0; m < bStock[0].length; m++) {
                  if(sub[l].masterBarangId == bStock[0][m].masterBarangId){
                    if(sub[l].jumlahBarangOP>0 && bStock[0][m].jumlahStock>0){
                      let jml = bStock[0][m].jumlahStock;
                      if(sub[l].jumlahBarangOP>bStock[0][m].jumlahStock){
                        bStock[0][m].jumlahStock=0;
                      }else{
                        bStock[0][m].jumlahStock -= sub[l].jumlahBarangOP;
                      }
                      sub[l].jumlahBarangOP -= jml;
                      if(sub[l].jumlahBarangOP<1){
                        sub[l].jumlahBarangOP=0;
                      }
                      hasil.push({id:bStock[0][m].id,jumlahStock:bStock[0][m].jumlahStock,tanggalKadaluarsa:bStock[0][m].tanggalKadaluarsa,masterBarangId:bStock[0][m].masterBarangId,batchNumber:bStock[0][m].batchNumber});
                    }
                  }
                };
              }
                // console.log("=====================H=====================");
                // console.log(hasil);
                // console.log("=====================B===================");
                // console.log(bonus);
                stock.bulkCreate(hasil,{updateOnDuplicate:["jumlahStock"]}).then((data3)=>{
                  let subOP = [];
                  for (let n = 0; n < bulkBarangOP.length; n++) {
                    for (let o = 0; o < hasil.length; o++) {
                      let x = {};
                      if(bulkBarangOP[n].masterBarangId==hasil[o].masterBarangId){
                        x["id"] = uuid_v4();
                        x["jumlahBarangOP"] = bulkBarangOP[n].jumlahBarangOP;
                        x["hargaJualOP"] = bulkBarangOP[n].hargaJualOP;
                        x["hargaTotalOP"] = bulkBarangOP[n].hargaTotalOP;
                        x["isBonus"] = bulkBarangOP[n].isBonus;
                        x["stockId"] = hasil[o].id;
                        x["transaksiOPId"] = idTrans;
                        subOP.push(x);
                      }
                    }
                  }
                  // console.log("+++++++++++++++++++++++++++++++");
                  // console.log(subOP);
                  subTransaksiOP.bulkCreate(subOP).then((data4)=>{
                    if(bonus.length==0){
                      res.status(200).json({status:200,message:"sukses"});
                    }else{
                      masterBarang.bulkCreate(bonus,{updateOnDuplicate:["jumlahTotalBarang"]}).then((data5)=>{
                        res.status(200).json({status:200,message:"sukses"});
                      }).catch((err)=>{
                        console.log("MB-bulk",err);
                        res.status(500).json({status:500,message:"gagal",data:err});
                      });
                    }
                  }).catch((err)=>{
                    console.log("Sub-bulk",err);
                    res.status(500).json({status:500,message:"gagal",data:err});
                  });
                }).catch((err)=>{
                  console.log("Stock-bulk",err);
                  res.status(500).json({status:500,message:"gagal",data:err});
                })
              }).catch((err)=>{
                console.log("Create",err);
                res.status(500).json({status:500,message:"gagal",data:err});
              });
          }
        }
      }
    }).catch((err)=>{
      console.log("find-All",err);
      res.status(500).json({status:500,message:"gagal",data:err});
    });
  }

  static updateTransaksiOP(req, res) {
    const {idTransaksiOP,namaPengirimOP,tanggalPengirimanOP,nomorDO,OPId,masterUserId,statusTransaksiOP} = req.body;
    transaksiOP.update({nomorDO,namaPengirimOP,tanggalPengirimanOP,OPId,masterUserId,statusTransaksiOP},{where: {id: idTransaksiOP}}).then((data) => {
        res.status(200).json({ status: 200, message: "sukses" });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static async listAllTransaksiOP(req, res) {
    let data = await sq.query(`select distinct to2.id as "transaksiOPId",o."nomorOP",to2."tanggalPengirimanOP", to2."nomorDO" , to2."createdAt" as "tglPenjualan", to2."masterUserId" ,mu.nama as "namaUser" ,o."metodePembayaranOP" , to2."statusTransaksiOP",o."masterCustomerId" , to2."createdAt", to2."updatedAt", to2."deletedAt" from "transaksiOP" to2 join "masterUser" mu on mu.id = to2."masterUserId" join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id join "OP" o on o.id = to2."OPId" join "masterCustomer" mc on mc.id = o."masterCustomerId" where to2."deletedAt" isnull and sto."deletedAt" isnull and o."deletedAt" isnull and mc."deletedAt" isnull `);
    // let data = await sq.query(`select distinct to2.id as "transaksiOPId",o."nomorOP",to2."tanggalPengirimanOP", to2."nomorDO" , to2."createdAt" as "tglPenjualan", to2."masterUserId" ,mu.nama as "namaUser" ,o."metodePembayaranOP" , to2."statusTransaksiOP",o."masterCustomerId",to2."pembatalanTransaksiOP",to2."createdAt", to2."updatedAt", to2."deletedAt" from "transaksiOP" to2 left join "masterUser" mu on mu.id = to2."masterUserId" left join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id left join "OP" o on o.id = to2."OPId" left join "masterCustomer" mc on mc.id = o."masterCustomerId" where to2."deletedAt" isnull and sto."deletedAt" isnull and o."deletedAt" isnull and mc."deletedAt" isnull order by to2."createdAt"`)
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
  static async listAllRescheduleTransaksiOP(req, res) {
    // let data = await sq.query(`select distinct to2.id as "transaksiOPId",o."nomorOP",to2."tanggalPengirimanOP", to2."nomorDO" , to2."createdAt" as "tglPenjualan", to2."masterUserId" ,mu.nama as "namaUser" ,o."metodePembayaranOP" , to2."statusTransaksiOP",o."masterCustomerId" , to2."createdAt", to2."updatedAt", to2."deletedAt" from "transaksiOP" to2 join "masterUser" mu on mu.id = to2."masterUserId" join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id join "OP" o on o.id = to2."OPId" join "masterCustomer" mc on mc.id = o."masterCustomerId" where to2."deletedAt" isnull and sto."deletedAt" isnull and o."deletedAt" isnull and mc."deletedAt" isnull `);
    // let data = await sq.query(`select distinct to2.id as "transaksiOPId",o."nomorOP",to2."tanggalPengirimanOP", to2."nomorDO" , to2."createdAt" as "tglPenjualan", to2."masterUserId" ,mu.nama as "namaUser" ,o."metodePembayaranOP" , to2."statusTransaksiOP",o."masterCustomerId",to2."pembatalanTransaksiOP",to2."createdAt", to2."updatedAt", to2."deletedAt" from "transaksiOP" to2 left join "masterUser" mu on mu.id = to2."masterUserId" left join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id left join "OP" o on o.id = to2."OPId" left join "masterCustomer" mc on mc.id = o."masterCustomerId" where to2."deletedAt" isnull and sto."deletedAt" isnull and o."deletedAt" isnull and mc."deletedAt" isnull order by to2."createdAt"`)
    let data = await sq.query(`select * from "transaksiOP" to2 join "OP" o on o.id = to2."OPId" join "masterUser" mu on mu.id = to2."masterUserId" where to2."deletedAt" isnull and o."deletedAt" isnull and mu."deletedAt" isnull and to2."pembatalanTransaksiOP" is not null order by to2."createdAt" `)
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listTransaksiOPById(req, res) {
    const { id } = req.params;
    let data = await sq.query(`select distinct to2.id as "transaksiOPId", to2."nomorDO" , to2."createdAt" as "tglPenjualan", to2."masterUserId" , o."metodePembayaranOP" , to2."statusTransaksiOP", to2."createdAt", to2."updatedAt", to2."deletedAt" from "transaksiOP" to2 join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id join "OP" o on o.id = to2."OPId" where to2."deletedAt" isnull and sto."deletedAt" isnull and o."deletedAt" isnull and to2 .id = '${id}'`);
    // console.log(data[0]);

    // let data2 = await sq.query(`
    //   select sto.id ,sto."masterBarangId" ,mb."namaBarang", sto."jumlahBarangOP" , sto."hargaJualOP" , sto."hargaTotalOP" , sto."isBonus" ,sto."createdAt" , sto."updatedAt" ,sto."deletedAt" 
    //   from "subTransaksiOP" sto 
    //   join "masterBarang" mb on mb.id = sto."masterBarangId" 
    //   where sto."transaksiOPId" = '${id}' 
    //   and sto."deletedAt" isnull 
    //   and mb."deletedAt" isnull `);
    let data2 = await sq.query(`select sto.id as "subTransaksiId",s."masterBarangId",mb."namaBarang",s."batchNumber",sto."jumlahBarangOP", sto."hargaJualOP", sto."hargaTotalOP",sto."isBonus", sto."createdAt", sto."updatedAt", sto."deletedAt" from "subTransaksiOP" sto join stock s ON sto."stockId" = s.id join "masterBarang" mb on mb.id = s."masterBarangId" where sto."deletedAt" isnull and s."deletedAt" isnull and mb."deletedAt" isnull and sto."transaksiOPId" = '${id}'`)
   
    let hasil = {
      transaksiOPId: data[0][0]["transaksiOPId"],
      nomorDO: data[0][0]["nomorDO"],
      tanggalPenjualan: data[0][0]["tglPenjualan"],
      masterUserId: data[0][0]["masterUserId"],
      metodePembayaranOP: data[0][0]["metodePembayaranOP"],
      statusTransaksiOP: data[0][0]["statusTransaksiOP"],
      createdAt: data[0][0]["createdAt"],
      updatedAt: data[0][0]["updatedAt"],
      deletedAt: data[0][0]["deletedAt"],
    };
    // console.log(hasil);
    hasil.dataBarang = data2[0];
    res.status(200).json({ status: 200, message: "sukses", data: hasil });
  }

  static async detailsOPByTransaksiId(req, res) {
    const {idTransaksi} = req.params
    let data  = await sq.query(`select sto.id as "subTransaksiId", * from "subTransaksiOP" sto join "transaksiOP" to2 ON to2.id = sto."transaksiOPId" join stock s on sto."stockId" = s.id join "masterBarang" mb on mb.id = s."masterBarangId" join "OP" o on to2."OPId" = o.id where to2."deletedAt" isnull and sto."deletedAt" isnull and s."deletedAt" isnull and mb."deletedAt" isnull and o."deletedAt" isnull and to2.id= '${idTransaksi}' order by to2."createdAt" `)
    let barang = await sq.query(`select to2.id as "transaksiOPId", to2."nomorDO" ,to2."OPId" , o."nomorOP" ,so."jumlahBarangSubOP" ,so."masterBarangId" from "transaksiOP" to2 join "OP" o on to2 ."OPId" = o.id join "subOP" so on so ."OPId" = to2."OPId" where to2."deletedAt" isnull and o."deletedAt" isnull and to2.id = '${idTransaksi}' order by to2 ."createdAt" `);
    
    // console.log(data[0]);
    // console.log("=======================================");
    // console.log(barang[0]);
    let hasil = [];
      let x = {
        transaksiOPId:data[0][0].transaksiOPId,
        nomorDO:data[0][0].nomorDO,
        tanggalPengirimanOP:data[0][0].tanggalPengirimanOP,
        namaPengirimOP:data[0][0].namaPengirimOP,
        nomorOP:data[0][0].nomorOP,
        masterCustomerId: data[0][0].masterCustomerId,
        PPNPenjualanOP:data[0][0].PPNPenjualanOP,
        dataBarang:[],
        dataBonus:[],
      }
    // console.log(barang[0]);
    // console.log(x);
    for (let i = 0; i < data[0].length; i++) {
      let z={
        subTransaksiId : data[0][i].subTransaksiId,
        namaBarang : data[0][i].namaBarang,
        jumlahOrder : 0,
        jumlahStock : data[0][i].jumlahStock,
        batchNumber : data[0][i].batchNumber,
        jumlahSubTransaksi : data[0][i].jumlahBarangOP,
        hargaJual : data[0][i].hargaJualOP,
        isBonus : data[0][i].isBonus
      };
      for (let j = 0; j < barang[0].length; j++) {
        if(data[0][i].masterBarangId == barang[0][j].masterBarangId){
        
        //  z['subTransaksiId'] = data[0][i].subTransaksiId;
        //  z['namaBarang'] = data[0][i].namaBarang;
         z['jumlahOrder'] = barang[0][j].jumlahBarangSubOP;
        //  z['jumlahStock'] = data[0][i].jumlahStock;
        //  z['batchNumber'] = data[0][i].batchNumber;
        //  z['jumlahSubTransaksi'] = data[0][i].jumlahBarangOP;
        //  z['hargaJual'] = data[0][i].hargaJualOP;
        //  z['isBonus'] = data[0][i].isBonus
        }
      }
      
      if(data[0][i].isBonus){
        x.dataBonus.push(z);
      }else{
        x.dataBarang.push(z)
      }
    }
    hasil.push(x);
    res.status(200).json({status:200,message:"sukses",data:hasil});
  }

  static async rescheduleTransaksiOP(req,res){
    const {transaksiOPId,tglUpdatetransaksiOP}=req.body;
    let date = moment().format("YYYY/MM/DD");
    transaksiOP.findAll({where:{id:transaksiOPId}}).then(async(data)=>{
      if (data.length==0) {
        res.status(200).json({status:200,message:"data tidak ada"});
      }else{
        let sub = await sq.query(`select * from "subTransaksiOP" sto where sto."deletedAt" isnull and sto."transaksiOPId" ='${transaksiOPId}'`);
        if(sub[0].length==0){
          res.status(200).json({status:200,message:"tanggal pengiriman sudah di ganti",data:sub[0]});
        }else{
          const idTOP = uuid_v4();
          transaksiOP.update({pembatalanTransaksiOP:date,rescheduleId:idTOP},{where:{id:data[0].id}}).then((data2)=>{
            transaksiOP.create({id:idTOP,namaPengirimOP:data[0].namaPengirimOP,tanggalPengirimanOP:tglUpdatetransaksiOP,nomorDO:data[0].nomorDO,statusTransaksiOP:data[0].statusTransaksiOP,OPId:data[0].OPId,masterUserId:data[0].masterUserId}).then((data2)=>{

              for (let i = 0; i < sub[0].length; i++) {
                sub[0][i].transaksiOPId=data3.id;
              }
              subTransaksiOP.bulkCreate(sub[0],{updateOnDuplicate:["transaksiOPId"]}).then((data4)=>{
                res.status(200).json({status:200,message:"sukses"});
              }).catch((err)=>{
                console.log("bulk",err);
                res.status(500).json({status:500,message:"gagal",data:err});
              });
            }).catch((err)=>{
              console.log("create",err);
              res.status(500).json({status:500,message:"gagal",data:err});
            });
          }).catch((err)=>{
            console.log("update",err);
            res.status(500).json({status:500,message:"gagal",data:err});
          })
        }
      }
    }).catch((err)=>{
      console.log("find-All",err);
      res.status(500).json({status:500,message:"gagal",data:err});
    });
  }
  static async listTransaksiOPByNoOP(req, res) {
    const {nomorOP}=req.params
    let data = await sq.query(`select to2.id ,to2."namaPengirimOP" ,to2."nomorDO",to2."statusTransaksiOP" ,o."nomorOP",mb."namaBarang",mb."kodeBarang",sto."jumlahBarangOP" , s."batchNumber" ,s."jumlahStock",sto."hargaJualOP" ,sto."hargaTotalOP", sto."isBonus" from "subTransaksiOP" sto 
    join "transaksiOP" to2 on sto."transaksiOPId" =to2.id
    join stock s on sto."stockId" =s.id
    join "masterBarang" mb on s."masterBarangId" =mb.id
    join "OP" o on to2."OPId" =o.id 
    where to2."deletedAt"  isnull  and o."deletedAt"  isnull and sto."deletedAt" isnull and s."deletedAt" isnull and mb."deletedAt" isnull
    and o."nomorOP" ='${nomorOP}' and to2."pembatalanTransaksiOP" isnull
     `)
     let data2 = await sq.query(`select to2.id ,to2."namaPengirimOP"  ,to2 ."nomorDO" ,to2."statusTransaksiOP",o."nomorOP" from "transaksiOP" to2 
     join "OP" o on to2."OPId" =o.id 
     where to2."deletedAt" isnull  and o."deletedAt" isnull and o."nomorOP" ='${nomorOP}' and to2."pembatalanTransaksiOP" isnull
     `)
     let a=data[0]
     let b=data2[0]
     let hasil=[]

     for (let i = 0; i < b.length; i++) {
       b[i].barang=[]
      
       for (let j = 0; j < a.length; j++) {
         if(b[i].id == a[j].id){
           let x={}
           x.namaBarang=a[j].namaBarang,
           x.hargaJualOP=a[j].hargaJualOP,
           x.hargaTotalOP=a[j].hargaTotalOP,
           x.jumlahBarangOP=a[j].jumlahBarangOP,
           x.isBonus=a[j].isBonus
          b[i].barang.push(x)
         }
       }

       hasil.push(b[i])
     }

    res.status(200).json({ status: 200, message: "sukses", data: hasil });
  }
}

module.exports = Controller;



 // static async register(req, res) {
  //   const {namaPengirimOP,tanggalPengirimanOP,nomorDO,OPId,masterUserId,statusTransaksiOP,bulkBarangOP} = req.body;
  //   if(!masterUserId){
  //     masterUserId = req.dataUsers.id;
  //   }
  //   let sub = JSON.parse(JSON.stringify(bulkBarangOP));
  //   const idTrans = uuid_v4();
  //   let dataDo = await transaksiOP.findAll({ where: { nomorDO } });
  //   if (dataDo.length) {
  //     res.status(200).json({ status: 200, message: "nomorDo sudah ada" });
  //   } else {
  //     let cek = false;
  //     let cekStock = [];
  //     let barang = [];
  //     let hasil = [];

  //     let data = await sq.query(`select sum(s."jumlahStock") as "total", mb."namaBarang", s."masterBarangId" from stock s join "masterBarang" mb on mb.id = s."masterBarangId" where s."deletedAt" isnull and mb."deletedAt" isnull group by s."masterBarangId", mb."namaBarang"`)
  //     for (let i = 0; i < sub.length; i++) {
  //       for (let j = 0; j < data[0].length; j++) {
  //         if(sub[i].masterBarangId == data[0][j].masterBarangId){
  //           if(sub[i].jumlahBarangOP>data[0][j].total){
  //             cek = true;
  //             cekStock.push({nama:data[0][j].namaBarang,stok:data[0][j].total,order:sub[i].jumlahBarangOP});
  //           }
  //         }
  //       }
  //       barang.push(sub[i].masterBarangId)
  //     }
      
      // if (cek) {
      //   res.status(200).json({ status: 200, message: "Stock tidak cukup", data: cekStock });
      // } else {
      //   console.log(barang);
      //   res.send("oke")
        // transaksiOP.create({id: idTrans,namaPengirimOP,tanggalPengirimanOP,nomorDO,OPId,masterUserId,statusTransaksiOP}).then(async (data2) => {
        //   let idBarang = `s."masterBarangId" = '${barang[0]}'`
        //   for (let k = 1; k < barang.length; k++) {
        //     idBarang+=` or s."masterBarangId" = '${barang[k]}'`
        //   }
        //   let dataBarang =  await sq.query(`select * from stock s where s."deletedAt" isnull and (${idBarang}) order by s."tanggalKadaluarsa", s."createdAt"`);
        //   for (let l = 0; l < sub.length; l++) {
        //     let order = sub[l];
        //     // console.log("==================",order);
        //     for (let m = 0; m < dataBarang[0].length; m++) {
        //       let stok = dataBarang[0][m];
        //       if(order.masterBarangId == stok.masterBarangId){
        //         if(order.jumlahBarangOP>0 && stok.jumlahStock>0){
        //           // console.log("*****************",stok);
        //           let jml = stok.jumlahStock;
        //           if(order.jumlahBarangOP>stok.jumlahStock){
        //             stok.jumlahStock -= stok.jumlahStock;
        //           }else{
        //             stok.jumlahStock -= order.jumlahBarangOP;
        //           }
        //           order.jumlahBarangOP -= jml;
        //           if(order.jumlahBarangOP<=0){
        //             order.jumlahBarangOP = 0;
        //           }
        //           hasil.push({id: stok.id,jumlahStock: stok.jumlahStock,tanggalKadaluarsa: stok.tanggalKadaluarsa,masterBarangId: stok.masterBarangId})
        //         }
        //       }
        //     }
        //   }
        //   stock.bulkCreate(hasil,{updateOnDuplicate:["jumlahStock"]}).then((data3)=>{
        //     let subOP = [];
        //     for (let n = 0; n < bulkBarangOP.length; n++) {
        //       for (let o = 0; o < hasil.length; o++) {
        //         let x = {};
        //         if (bulkBarangOP[n].masterBarangId == hasil[o].masterBarangId) {
        //           x["id"] = uuid_v4();
        //           x["jumlahBarangOP"] = bulkBarangOP[n].jumlahBarangOP;
        //           x["hargaJualOP"] = bulkBarangOP[n].hargaJualOP;
        //           x["hargaTotalOP"] = bulkBarangOP[n].hargaTotalOP;
        //           x["isBonus"] = bulkBarangOP[n].isBonus;
        //           x["stockId"] = hasil[o].id;
        //           x["transaksiOPId"] = idTrans;
        //           subOP.push(x);
        //         }
        //       }
        //     }
        //     subTransaksiOP.bulkCreate(subOP).then((data4)=>{
        //       console.log(data4)
        //       res.status(200).json({ status: 200, message: "sukses" });
        //     }).catch((err)=>{
        //       res.status(500).json({ status: 500, message: "gagal", data: err });
        //     });
        //   });
        // });
  //     }
  //   }
  // }


  // static register(req,res){
  //   let {namaPengirimOP,tanggalPengirimanOP,nomorDO,OPId,masterUserId,statusTransaksiOP,bulkBarangOP} = req.body;
  //   if(!masterUserId){
  //     masterUserId = req.dataUsers.id;
  //   }
  //   let sub = JSON.parse(JSON.stringify(bulkBarangOP));
  //   const idTrans = uuid_v4();
  //   transaksiOP.findAll({where:{nomorDO}}).then(async(data)=>{
  //     if(data.length){
  //       res.status(200).json({status:200,message:"nomorDO sudah ada"});
  //     }else{
  //       let cek = false;
  //       let cekStock = [];
  //       let barang=[];
  //       let isi = "";
  //       let isiBarang="";

  //       for (let i = 1; i < sub.length; i++) {
  //         isi+=` or mb.id = '${sub[i].masterBarangId}'`
  //       }
  //       let mstok = await sq.query(`select sum(s."jumlahStock") as "total", mb."namaBarang", s."masterBarangId",mb."jumlahTotalBarang" from stock s join "masterBarang" mb on mb.id = s."masterBarangId" where s."deletedAt" isnull and mb."deletedAt" isnull and mb.id = '${sub[0].masterBarangId}'${isi} group by s."masterBarangId", mb."namaBarang",mb."jumlahTotalBarang"`);
  //       for (let j = 0; j < sub.length; j++) {
  //         if(j>0){
  //           isiBarang+=` or s."masterBarangId" = '${sub[j].masterBarangId}'`;
  //         }
  //         for (let k = 0; k < mstok[0].length; k++) {
  //           if(sub[j].masterBarangId == mstok[0][k].masterBarangId){
  //             if(sub[j].jumlahBarangOP > mstok[0][k].total){
  //               cek = true;
  //               cekStock.push({namaBarang:mstok[0][k].namaBarang,stock:mstok[0][k].total,order:sub[j].jumlahBarangOP});
  //             }
  //             if(sub[j].isBonus){
  //               barang.push({id:sub[j].masterBarangId,namaBarang:mstok[0][k].namaBarang,jumlahTotalBarang:mstok[0][k].jumlahTotalBarang-sub[j].jumlahBarangOP});
  //             }
  //           }
  //         }
  //       }
  //       if(cek){
  //         res.status(200).json({status:200,message:"stock tidak cukup",data:cekStock});
  //       }else{
  //         // console.log(barang);
  //         transaksiOP.create({id: idTrans,namaPengirimOP,tanggalPengirimanOP,nomorDO,OPId,masterUserId,statusTransaksiOP}).then(async(data2)=>{
  //           let hasil = [];
  //           let bStock = await sq.query(`select * from stock s where s."deletedAt" isnull and s."jumlahStock" > 0 and s."masterBarangId" = '${sub[0].masterBarangId}'${isiBarang} order by s."tanggalKadaluarsa", s."createdAt"`);
  //           // console.log(bStock[0]);
  //           for (let l = 0; l < sub.length; l++) {
  //             for (let m = 0; m < bStock[0].length; m++) {
  //               if(sub[l].masterBarangId == bStock[0][m].masterBarangId){
  //                 if(sub[l].jumlahBarangOP > 0 & bStock[0][m].jumlahStock > 0){
  //                   let jml = bStock[0][m].jumlahStock;
  //                   if(sub[l].jumlahBarangOP > bStock[0][m].jumlahStock){
  //                     bStock[0][m].jumlahStock = 0;
  //                   }else{
  //                     bStock[0][m].jumlahStock -= sub[l].jumlahBarangOP;
  //                   }
  //                   sub[l].jumlahBarangOP -= jml;
  //                   if(sub[l].jumlahBarangOP < 1){
  //                     sub[l].jumlahBarangOP = 0;
  //                   }
  //                   hasil.push({id:bStock[0][m].id,jumlahStock:bStock[0][m].jumlahStock,tanggalKadaluarsa:bStock[0][m].tanggalKadaluarsa,masterBarangId:bStock[0][m].masterBarangId,batchNumber:bStock[0][m].batchNumber});
  //                 }
  //               }
  //             }
  //           }
  //           // console.log("=====================H=====================");
  //           // console.log(hasil);
  //           // console.log("=====================B===================");
  //           // console.log(barang);
  //           // res.send("oke");
  //           stock.bulkCreate(hasil,{updateOnDuplicate:["jumlahStock"]}).then((data3)=>{
  //             let subOP=[];
  //             for (let n = 0; n < bulkBarangOP.length; n++) {
  //               for (let o = 0; o < hasil.length; o++) {
  //                 let x = {};
  //                 if(bulkBarangOP[n].masterBarangId==hasil[o].masterBarangId){
  //                   x["id"] = uuid_v4();
  //                   x["jumlahBarangOP"] = bulkBarangOP[n].jumlahBarangOP;
  //                   x["hargaJualOP"] = bulkBarangOP[n].hargaJualOP;
  //                   x["hargaTotalOP"] = bulkBarangOP[n].hargaTotalOP;
  //                   x["isBonus"] = bulkBarangOP[n].isBonus;
  //                   x["stockId"] = hasil[o].id;
  //                   x["transaksiOPId"] = idTrans;
  //                   subOP.push(x);
  //                 }
  //               }
  //             }
  //             // console.log("+++++++++++++++++++++++++++++++");
  //             // console.log(subOP);
  //             subTransaksiOP.bulkCreate(subOP).then((data4)=>{
  //              if(barang.length==0){
  //                res.status(200).json({status:200,message:"sukses"});
  //              }else{
  //               masterBarang.bulkCreate(barang,{updateOnDuplicate:["jumlahTotalBarang"]}).then((data5)=>{
  //                 res.status(200).json({status:200,message:"sukses"});
  //               }).catch((err)=>{
  //                 console.log("MB-Bulk",err);
  //                 res.status(500).json({status:500,message:"gagal",data:err});
  //               });
  //              }
  //             }).catch((err)=>{
  //               console.log("Sub-Bulk",err);
  //               res.status(500).json({status:500,message:"gagal",data:err});
  //             });
  //           }).catch((err)=>{
  //             console.log("S-Bulk",err);
  //             res.status(500).json({status:500,message:"gagal",data:err});
  //           });
  //         }).catch((err)=>{
  //           console.log("Create",err);
  //           res.status(500).json({status:500,message:"gagal",data:err});
  //         });
  //       }
  //     }
  //   }).catch((err)=>{
  //     console.log("find-All",err);
  //     res.status(500).json({status:500,message:"gagal",data:err});
  //   });
  // }

