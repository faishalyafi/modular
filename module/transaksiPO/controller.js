const transaksiPO = require("./model");
const subTransaksiPO = require("../subTransaksiPO/model");
const stock = require("../stock/model");
const masterBarang = require("../../model/masterBarangModel");

const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
  static async register(req, res) {
    //! stock = jumlah Barang subTransaksi
    const { POId, noInvoice, tglKedatangan, keterangan, bulkBarang, gudangId } = req.body;
    let barangM = `mb.id='${bulkBarang[0].masterBarangId}'`;
    let batch = `s."batchNumber"= '${bulkBarang[0].batchNumber}'`;
    for (let i = 1; i < bulkBarang.length; i++) {
      batch += ` or s."batchNumber"= '${bulkBarang[i].batchNumber}'`;
      barangM += ` or mb.id='${bulkBarang[i].masterBarangId}'`;
    }
    // console.log(barangM);
    // console.log(batch);
    let cekKode = await sq.query(`select * from stock s where s."deletedAt" isnull and (${batch})`);
    let barang = await sq.query(`select * from "masterBarang" mb where mb ."deletedAt" isnull and (${barangM})`);
    // console.log(barang[0]);
    // console.log("===============================");
    // console.log(cekKode[0]);
    // console.log("===============================");    
    if (cekKode[0].length) {
      res.status(200).json({ status: 200, message: "batch sudah ada" });
    } else {
      transaksiPO.create({id: uuid_v4(),POId,nomorInvoice: noInvoice,tglKedatangan: tglKedatangan,keterangan: keterangan}).then((data) => {
          for (let m = 0; m < bulkBarang.length; m++) {
            bulkBarang[m].id = uuid_v4();
            bulkBarang[m].transaksiPOId = data.id;
            bulkBarang[m].gudangId = gudangId;
          }
          subTransaksiPO.bulkCreate(bulkBarang).then((data2) => {
            for (let i = 0; i < bulkBarang.length; i++) {
              for (let l = 0; l < data2.length; l++) {
                bulkBarang[i].id = uuid_v4();
                if (bulkBarang[i].masterBarangId == data2[l].masterBarangId) {
                  bulkBarang[i].subTransaksiPOId = data2[l].id;
                }
                bulkBarang[i].gudangId = gudangId;
              }
            }
            stock.bulkCreate(bulkBarang).then((data3) => {
              for (let j = 0; j < barang[0].length; j++) {
                for (let k = 0; k < bulkBarang.length; k++) {
                  if (barang[0][j].id == bulkBarang[k].masterBarangId) {
                    barang[0][j].jumlahTotalBarang += bulkBarang[k].jumlahStock;
                  }
                }
              }
              masterBarang.bulkCreate(barang[0], {updateOnDuplicate: ["jumlahTotalBarang"]}).then((data4) => {
                  res.status(200).json({ status: 200, message: "sukses" });
                }).catch((err)=>{
                  res.status(500).json({ status: 500, message: "gagal",data:err });
                });
              });
          });
        });
    }
  }

  static async detailsById(req, res) {
    const { id } = req.params;
    let data = await sq.query(`
      select tp."id" as "transaksiPOId",* 
      from "transaksiPO" tp 
      join "subTransaksiPO" stp on tp."id" = stp."transaksiPOId" 
      join "masterBarang" mb on stp."masterBarangId" = mb."id"
      where tp."id" = '${id}'
      and tp."deletedAt" isnull 
      and stp."deletedAt" isnull 
      and mb."deletedAt" isnull`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async detailsTransaksiByNomorPO(req, res) {
    const { nomorPO } = req.params;
    let data = await sq.query(`
      select distinct  p.id as "POId",tp.id as "transaksiPOId",stp.id as "subTransaksiPOId",to_char("tglKedatangan" ,'dd-mm-yyyy')as "tanggalKedatangan",* 
      from "transaksiPO" tp 
      join "subTransaksiPO" stp on tp."id" = stp."transaksiPOId" 
      join "PO" p on tp."POId" = p."id" 
      join "masterSupplier" ms on p."masterSupplierId" = ms."id" 
      join "masterBarang" mb on stp."masterBarangId" =mb.id
      join "masterKategoriBarang" mkb on mb."masterKategoriBarangId" =mkb.id 
      where  p."nomorPO"='${nomorPO}' 
      and tp."deletedAt" isnull 
      and stp."deletedAt" isnull 
      and p."deletedAt" isnull 
      and ms."deletedAt" isnull 
      and mb."deletedAt" isnull 
      order by "tanggalKedatangan"`);

    let jumlahOrder = await sq.query(`
      select mb."namaBarang",mb.id as "masterBarangId" ,sp.jumlah as "totalOrder"
      from "PO" p 
      join "subPO" sp on p.id = sp."POId" 
      join "masterBarang" mb on sp."masterBarangId" = mb.id 
      where p."nomorPO" ='${nomorPO}' 
      and p."deletedAt" isnull 
      and sp."deletedAt" isnull 
      and mb."deletedAt" isnull`);

    let x = data[0];
    let y = jumlahOrder[0];
    let hasil = {
      nomorPO: x[0]["nomorPO"],
      tanggalPO: x[0]["tanggalPO"],
      namaSupplier: x[0]["namaSupplier"],
    };

    transaksiPO
      .findAll({
        where: {
          POId: x[0]["POId"],
        },
        include: {
          model: subTransaksiPO,
          include: masterBarang,
        },
        order: ["tglKedatangan"],
      })
      .then((n) => {
        for (let i = 0; i < n.length; i++) {
          for (let j = 0; j < n[i]["subTransaksiPOs"].length; j++) {
            // console.log(n[i]["subTransaksiPOs"][j]["dataValues"]["masterBarangId"]);
            for (let k = 0; k < y.length; k++) {
              if (
                n[i]["subTransaksiPOs"][j]["dataValues"]["masterBarangId"] ==
                y[k]["masterBarangId"]
              ) {
                n[i]["subTransaksiPOs"][j]["dataValues"]["sisaOrder"] =
                  y[k]["totalOrder"];
                n[i]["subTransaksiPOs"][j]["dataValues"]["sisaKurang"] =
                  y[k]["totalOrder"] -
                  n[i]["subTransaksiPOs"][j]["dataValues"][
                    "jumlahBarangSubTransaksiPO"
                  ];
                y[k]["totalOrder"] =
                  n[i]["subTransaksiPOs"][j]["dataValues"]["sisaKurang"];
              }
            }
          }
        }

        hasil.transaksi = n;
        res.json(n);
      });

    // let x = data[0];
    // let y = jumlahOrder[0];
    // // console.log("a : ",x,"b: ",y);
    // let transaksi = [];
    // let hasil = {
    //   nomorPO: x[0]["nomorPO"],
    //   tanggalPO: x[0]["tanggalPO"],
    //   namaSupplier: x[0]["namaSupplier"],
    // };
    // // console.log("x",x.length);
    // for (let i = 0; i < x.length; i++) {
    //   let sama = 0;
    //   // console.log("a",sama);
    //   for (let j = 0; j < transaksi.length; j++) {
    //     if (transaksi[j]["tanggalKedatangan"] == x[i]["tanggalKedatangan"]) {
    //       transaksi[j]["barang"].push({
    //         namaBarang: x[i]["namaBarang"],
    //         jumlah: x[i]["jumlahBarangSubTransaksiPO"],
    //         namaKategori: x[i]["namaKategori"],
    //       });
    //       sama = 1;
    //     }
    //   }
    //   if (sama == 0) {
    //     transaksi.push({
    //       tanggalKedatangan: x[i]["tanggalKedatangan"],
    //       barang: [
    //         {
    //           namaBarang: x[i]["namaBarang"],
    //           jumlah: x[i]["jumlahBarangSubTransaksiPO"],
    //           namaKategori: x[i]["namaKategori"],
    //         },
    //       ],
    //     });
    //   }
    //   // console.log("b",transaksi[i]);
    //   // console.log("c",x[i]["tanggalKedatangan"]);
    // }

    // for (let i = 0; i < transaksi.length; i++) {
    //   // console.log("i",i);
    //   for (let j = 0; j < y.length; j++) {
    //     // console.log("j",j);
    //     for (let n in transaksi[i]["barang"]) {
    //       // console.log("n",n);
    //       // console.log("nama",transaksi[i]["barang"][n]["namaBarang"]);
    //       if (y[j]["namaBarang"] == transaksi[i]["barang"][n]["namaBarang"]) {
    //         transaksi[i]["barang"][n]["order"] = y[j]["totalOrder"];
    //         transaksi[i]["barang"][n]["sisa"] =y[j]["totalOrder"] - transaksi[i]["barang"][n]["jumlah"];
    //         y[j]["totalOrder"] = transaksi[i]["barang"][n]["sisa"];
    //       }
    //     }
    //   }
    // }
    // hasil.transaksi = transaksi;
    // res.status(200).json({ status: 200, message: "sukses", data: hasil });
  }

  static async historyAllTransaksi(req, res) {
    let data = await sq.query(`
    select p."nomorPO", ms."namaSupplier",p."tanggalPO",p."rencanaTglKedatangan",sp."jumlah" as "jumlahBarangPO",stp."jumlahBarangSubTransaksiPO" as "jumlahBarangTransaksi", (sp."jumlah" - stp."jumlahBarangSubTransaksiPO") as "sisa",tp."createdAt", tp."updatedAt", tp."deletedAt" 
    from "transaksiPO" tp 
    join "subTransaksiPO" stp on tp."id" = stp."transaksiPOId" 
    join "PO" p on tp."POId" = p."id" 
    join "subPO" sp on sp."masterBarangId" = stp."masterBarangId" 
    join "masterSupplier" ms on p."masterSupplierId" = ms."id" 
    where sp."deletedAt" isnull and stp."deletedAt" isnull 
    and tp."deletedAt" isnull and p."deletedAt" isnull and ms."deletedAt" isnull `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listAllTransaksi(req, res) {
    let data = await sq.query(`select distinct p."nomorPO", ms."namaSupplier" ,p."rencanaTglKedatangan" ,p."tanggalPO" ,sum(stp."jumlahBarangSubTransaksiPO") as "jumlahDatang",(select distinct sum(sp.jumlah) as "jumlahOrder" from "PO" p2 join "subPO" sp on p2.id = sp."POId" where p2.id = p.id) from "PO" p join "masterSupplier" ms on ms.id = p."masterSupplierId" left join "transaksiPO" tp on p.id = tp."POId" left join "subTransaksiPO" stp on stp."transaksiPOId" = tp.id where p."deletedAt" isnull and tp."deletedAt" isnull and stp."deletedAt" isnull group by p.id , ms."namaSupplier" `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  // static async update(req, res) {
  //   const {transaksiPOId,POId,noInvoice,tglKedatangan,keterangan,bulkBarang,gudangId} = req.body;
    // transaksiPO.update({POId,nomorInvoice: noInvoice,tglKedatangan: tglKedatangan,keterangan: keterangan},{where: {id: transaksiPOId}}).then((data) => {
    //     // console.log(data);
    //     for (let i = 0; i < bulkBarang.length; i++) {
    //       bulkBarang[i].transaksiPOId = transaksiPOId;
    //       bulkBarang[i].gudangId = gudangId;
    //     }
    //     subTransaksiPO.bulkCreate(bulkBarang, {updateOnDuplicate: ["jumlahBarangSubTransaksiPO"]}).then((data) => {
    //         res.status(200).json({status: 200,message: "sukses"});
    //       });
    //   }).catch((err) => {
    //     console.log(err);
    //     res.status(500).json({status: 500,message: "gagal",data: err});
    //   });
  // }

  static async update(req,res){
    const {transaksiPOId,POId,noInvoice,tglKedatangan,keterangan,bulkBarang,gudangId} = req.body;
    
    transaksiPO.findAll({where:{id:transaksiPOId}}).then(async(data)=>{
      // console.log(data.length);
      if(data.length==0){
        res.status(200).json({status:200,message:"data tidak ada"});
      }else{
        let isi=``;
        let mBarang=[];
        let sub = await sq.query(`select stp.id as "subTransaksiPOId",* from "subTransaksiPO" stp join "masterBarang" mb on mb.id = stp."masterBarangId" where stp."deletedAt" isnull and mb."deletedAt" isnull and stp."transaksiPOId" = '${transaksiPOId}'`);
        for (let i = 1; i < sub[0].length; i++) {
            isi+=` or s."subTransaksiPOId" = '${sub[0][i].subTransaksiPOId}'`;
        }
        let mStock = await sq.query(`select * from stock s where s."deletedAt" isnull and s."subTransaksiPOId" = '${sub[0][0].subTransaksiPOId}'${isi}`);
        // console.log("==================SubL===================");
        // console.log(sub[0]);
        // console.log("================SL=====================");
        // console.log(mStock[0]);
        for (let j = 0; j < bulkBarang.length; j++) {
          for (let k = 0; k < sub[0].length; k++) {
            if(bulkBarang[j].masterBarangId==sub[0][k].masterBarangId){
              let hasil = bulkBarang[j].jumlahBarangSubTransaksiPO-sub[0][k].jumlahBarangSubTransaksiPO
              mBarang.push({id:sub[0][k].masterBarangId,namaBarang:sub[0][k].namaBarang,jumlahTotalBarang:sub[0][k].jumlahTotalBarang+hasil});
            }
          }
          for (let l = 0; l < mStock[0].length; l++) {
            if(bulkBarang[j].masterBarangId==mStock[0][l].masterBarangId){
              mStock[0][l].jumlahStock=bulkBarang[j].jumlahStock;
            }
          }
        }
        // console.log("**********************************************");
        // console.log("==================SubB===================");
        // console.log(sub[0]);
        // console.log("================SB=====================");
        // console.log(mStock[0]);
        // console.log("================B=====================");
        // console.log(mBarang);
        transaksiPO.update({POId,nomorInvoice: noInvoice,tglKedatangan: tglKedatangan,keterangan: keterangan},{where: {id: transaksiPOId}}).then((data2)=>{
         subTransaksiPO.bulkCreate(bulkBarang,{updateOnDuplicate:["hargaTransaksi","jumlahHargaPerItem","jumlahBarangSubTransaksiPO"]}).then((data3)=>{
          stock.bulkCreate(mStock[0],{updateOnDuplicate:["jumlahStock"]}).then((data4)=>{
            masterBarang.bulkCreate(mBarang,{updateOnDuplicate:["jumlahTotalBarang"]}).then((data5)=>{
              res.status(200).json({status:200,message:"sukses"});
            }).catch((err)=>{
              console.log("MB",err);
              res.status(500).json({status:500,message:"gagal",data:err})
            });
          }).catch((err)=>{
            console.log("stock",err);
            res.status(500).json({status:500,message:"gagal",data:err});
          });
         }).catch((err)=>{
          console.log("subBulk",err);
          res.status(500).json({status:500,message:"gagal",data:err});
         });
        }).catch((err)=>{
          console.log("update",err);
          res.status(500).json({status:500,message:"gagal",data:err});
        });
      }
    }).catch((err)=>{
      console.log("findAll",err);
      res.status(500).json({status:500,message:"gagal",data:err});
    })
  }


  // static updateBarang(req, res) {
  //   const { transaksiPOId, bulkBarang, gudangId } = req.body;
  //   subTransaksiPO
  //     .destroy({
  //       where: {
  //         transaksiPOId: transaksiPOId,
  //       },
  //     })
  //     .then((hasil) => {
  //       console.log(bulkBarang);
  //       for (let i = 0; i < bulkBarang.length; i++) {
  //         bulkBarang[i].id = uuid_v4();
  //         bulkBarang[i].transaksiPOId = transaksiPOId;
  //         bulkBarang[i].gudangId = gudangId;
  //       }
  //       subTransaksiPO.bulkCreate(bulkBarang).then((hasil2) => {
  //         res.status(200).json({ status: 200, message: "sukses" });
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ status: 500, message: "gagal", data: err });
  //     });
  // }

  static async delete(req, res) {
    const { id } = req.body;
    let data = await sq.query(`select stp.id as "stpId",* from "subTransaksiPO" stp join "transaksiPO" tp ON tp.id = stp."transaksiPOId" join "masterBarang" mb on mb.id = stp."masterBarangId" where stp."deletedAt" isnull and tp."deletedAt" isnull and tp.id = '${id}'`);
    if(data[0].length==0){
      res.status(200).json({status:200,message:"data tidak ada"});
    }else{
      let mBarang = [];
      let subTp = [];
      // console.log(data[0]);
      // console.log("=====================================");
      for (let i = 0; i < data.length; i++) {
        mBarang.push({id:data[0][i].masterBarangId, namaBarang:data[0][i].namaBarang,jumlahTotalBarang:data[0][i].jumlahTotalBarang-data[0][i].jumlahBarangSubTransaksiPO});
        subTp.push(data[0][i].stpId)
      }
      // console.log(mBarang);
      // console.log("----ST------");
      // console.log(subTp);
      // res.send("oke");
      transaksiPO.destroy({where: {id:id}}).then((data2) => {
          subTransaksiPO.destroy({where: {transaksiPOId: id}}).then((data3) => {
             masterBarang.bulkCreate(mBarang,{updateOnDuplicate:['jumlahTotalBarang']}).then((data4)=>{
               stock.destroy({where:{subTransaksiPOId:subTp}}).then((data5)=>{
                 res.status(200).json({status:200,message:"sukses"});
               }).catch((err) => {
                 console.log("stock");
                res.status(500).json({status: 500,message: "gagal",data: err});
              });
             }).catch((err) => {
              console.log("MB");
             res.status(500).json({status: 500,message: "gagal",data: err});
            });
          }).catch((err) => {
            console.log("SUB");
           res.status(500).json({status: 500,message: "gagal",data: err});
          });
        }).catch((err) => {
          console.log("TPO");
          res.status(500).json({status: 500,message: "gagal",data: err});
      });
    }
  }
}

module.exports = Controller;
