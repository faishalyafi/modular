const produksiModel = require("./produksiModel");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const stock = require("../../module/stock/model");
const moment = require("moment");
const masterBarang = require("../../module/masterBarang/model");

class Controller {
  static register(req, res) {
    let {
      formulaId,
      tanggalRencanaProduksi,
      jumlahProduksi,
      masterUserId,
      statusProduksi,
      gudangId,
    } = req.body;
    // console.log(req.dataUsers);
    if (!masterUserId) {
      masterUserId = req.dataUsers.id;
    }
    produksiModel
      .create({
        id: uuid_v4(),
        formulaId,
        tanggalRencanaProduksi,
        jumlahProduksi,
        masterUserId,
        statusProduksi,
        gudangId,
      })
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses" });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static list(req, res) {
    produksiModel
      .findAll()
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static detailsById(req, res) {
    const { id } = req.params;
    produksiModel
      .findAll({
        where: {
          id: id,
        },
      })
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static async update(req, res) {
    const {
      produksiId,
      kodeBatch,
      tanggalProduksi,
      tanggalSelesaiProduksi,
      kodeProduksi,
      realisasiJumlahProduksi,
      masterUserId,
      statusProduksi,
      gudangId,
    } = req.body;

    let mb1 = await sq.query(
      `select p.id as "produksiId",*
      from produksi p 
      join formula f on f.id = p."formulaId" 
      where p.id ='${produksiId}' 
      and p."deletedAt" isnull 
      and f."deletedAt" isnull  `
    );
    
    let tglKadaluarsa = moment(tanggalSelesaiProduksi)
      .add(mb1[0][0].ketahananBarang, "days")
      .calendar();

    produksiModel
      .update(
        {
          kodeBatch,
          tanggalProduksi,
          tanggalSelesaiProduksi,
          tanggalKadaluarsa: tglKadaluarsa,
          kodeProduksi,
          realisasiJumlahProduksi,
          masterUserId,
          statusProduksi,
          gudangId,
        },
        { where: { id: produksiId }, returning: true }
      )
      .then(async (data) => {
        if (statusProduksi == 2) {
          let mb = await sq.query(
            `select p."kodeBatch",f."ketahananBarang" ,f."masterBarangId" as "fMasterBarangId",(select mb2."jumlahTotalBarang" from "masterBarang" mb2 join formula f2 on f2."masterBarangId" = mb2.id where f2.id = f.id ) ,sp."masterBarangId" 
            from produksi p 
            join formula f on f.id = p."formulaId" 
            join "subProduksi" sp on sp."produksiId" = p.id 
            join "masterBarang" mb on mb.id = sp."masterBarangId" 
            where p.id = '${produksiId}' 
            and p."deletedAt" isnull 
            and f."deletedAt" isnull 
            and sp."deletedAt" isnull 
            and mb."deletedAt" isnull `
          );
     
          let barang = await sq.query(
            `select sp."masterBarangId" ,sp."jumlahBahanProduksi" ,s."hargaBeliSatuanStock" 
            from "subProduksi" sp 
            join stock s on s.id = sp."stockId" 
            where sp."produksiId" = '${produksiId}' 
            and sp."deletedAt" isnull 
            and s."deletedAt" isnull `
          );

          let hasil = [];
          for (let i = 0; i < mb[0].length; i++) {
            for (let j = 0; j < barang[0].length; j++) {
              if (mb[0][i].masterBarangId == barang[0][j].masterBarangId) {
                hasil.push({
                  masterBarangId: mb[0][i].masterBarangId,
                  jumlahBahanProduksi: barang[0][j].jumlahBahanProduksi,
                  hargaBeliSatuanStock: barang[0][j].hargaBeliSatuanStock
                });
              }
            }
          }

          let total = 0;
          for (let k = 0; k < hasil.length; k++) {
            total += hasil[k].jumlahBahanProduksi * hasil[k].hargaBeliSatuanStock;
          }

          let hargaJadi = total / realisasiJumlahProduksi;
          
          let masterBarangId;
          for (let k = 0; k < mb[0].length; k++) {
            masterBarangId = mb[0][k].fMasterBarangId
          }
          stock
            .create(
              {
                id: uuid_v4(),
                jumlahStock: data[1][0].realisasiJumlahProduksi,
                tanggalMasuk: null,
                tanggalKadaluarsa: data[1][0].tanggalKadaluarsa,
                hargaBeliSatuanStock: hargaJadi,
                gudangId: data[1][0].gudangId,
                masterBarangId: masterBarangId,
                subTransaksiOPId: null,
                batchNumber: data[1][0].kodeBatch,
              },
              { returning: true }
            )
            .then((data2) => {
              let total = parseInt(mb[0][0].jumlahTotalBarang) + parseInt(realisasiJumlahProduksi);
              masterBarang
                .update(
                  { jumlahTotalBarang: total },
                  { where: { id: masterBarangId } }
                )
                .then((data3) => {
                  res.status(200).json({ status: 200, message: "sukses" });
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ status: 500, message: "gagal", data: err });
                });
            });
        } else {
          res.status(200).json({ status: 200, message: "sukses" });
        }
      });
  }

  static delete(req, res) {
    const { produksiId } = req.body;
    produksiModel
      .destroy({
        where: {
          id: produksiId,
        },
      })
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static async listByStatusProduksi(req, res) {
    let { statusProduksi } = req.params;
    let data = await sq.query(`
    select distinct p.id as "produksiId", p."kodeBatch",p."tanggalRencanaProduksi" ,p."tanggalProduksi",p."tanggalSelesaiProduksi", p."tanggalKadaluarsa", p."kodeProduksi",p."jumlahProduksi",p."realisasiJumlahProduksi",p."statusProduksi",p."formulaId",p."masterUserId",p."gudangId",p."deletedAt" ,p."createdAt" ,f."masterBarangId",f."keteranganFormula"  
    from produksi p 
    join formula f on f.id = p."formulaId" 
    join "subFormula" sf on sf."formulaId" = f.id 
    join "masterBarang" mb on mb.id = sf."masterBarangId" 
    where p."deletedAt" isnull 
    and f."isActive" = 1
    and sf."deletedAt" isnull 
    and mb."deletedAt" isnull 
    and p."statusProduksi" = ${statusProduksi} 
    group by(p.id,f.id, f."masterBarangId" , f."keteranganFormula" )  order by p."createdAt" `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async detailsListByStatusProduksi(req, res) {
    let { statusProduksi, produksiId } = req.params;
    let data = await sq.query(`
    select p.id as "produksiId", p."kodeBatch",p."tanggalRencanaProduksi" ,p."tanggalProduksi",p."tanggalSelesaiProduksi", p."tanggalKadaluarsa", p."kodeProduksi",p."jumlahProduksi",p."realisasiJumlahProduksi",p."statusProduksi",p."formulaId",p."masterUserId",p."gudangId",p."deletedAt" ,p."createdAt" ,f."masterBarangId" as "masterBarangId1" ,( select "namaBarang" as "namaBarang1" from "masterBarang" join formula f2 on f2."masterBarangId"="masterBarang".id where f.id = f2.id), sf."masterBarangId",mb."namaBarang", sf."jumlahBarangFormula" as "jumlahBarangFormula",f."keteranganFormula"  
    from produksi p 
    join formula f on f.id = p."formulaId" 
    join "subFormula" sf on sf."formulaId" = f.id 
    join "masterBarang" mb on mb.id = sf."masterBarangId" 
    where p."deletedAt" isnull 
    and f."isActive" = 1
    and sf."deletedAt" isnull 
    and mb."deletedAt" isnull 
    and p."statusProduksi" = ${statusProduksi} 
    and p.id = '${produksiId}'
    group by(p.id,f.id, f."masterBarangId" ,sf."masterBarangId" ,mb."namaBarang" ,sf."jumlahBarangFormula", f."keteranganFormula" )  order by p."createdAt"  `);

    let cekStock = await sq.query(`
    select s.id,s."masterBarangId", mb."namaBarang", s."jumlahStock" 
    from stock s 
    join "masterBarang" mb on mb.id = s."masterBarangId" 
    where s."deletedAt" isnull 
    and mb."deletedAt" isnull `);

    let produksi = {
      produksiId: data[0][0]["produksiId"],
      kodeBatch: data[0][0]["kodeBatch"],
      tanggalRencanaProduksi: data[0][0]["tanggalRencanaProduksi"],
      tanggalProduksi: data[0][0]["tanggalProduksi"],
      tanggalSelesaiProduksi: data[0][0]["tanggalSelesaiProduksi"],
      kodeProduksi: data[0][0]["kodeProduksi"],
      jumlahProduksi: data[0][0]["jumlahProduksi"],
      keteranganFormula: data[0][0]["keteranganFormula"],
      masterBarangId: data[0][0]["masterBarangId1"],
      namaBarang: data[0][0]["namaBarang1"],
    };

    let dataBarang = [];
    for (let i = 0; i < data[0].length; i++) {
      let isi = {
        masterBarangId: data[0][i]["masterBarangId"],
        namaBarang: data[0][i]["namaBarang"],
        jumlahBarangFormula: data[0][i]["jumlahBarangFormula"],
      };

      for (let j = 0; j < cekStock[0].length; j++) {
        if (cekStock[0][j]["masterBarangId"] == data[0][i]["masterBarangId"]) {
          isi.stockTersedia = cekStock[0][j]["jumlahStock"];
        }
      }

      dataBarang.push(isi);
    }
    produksi.dataBarangProduksi = dataBarang;
    res.status(200).json({ status: 200, message: "sukses", data: produksi });
  }

  static async listALLCancelProduksi(req, res) {
    let data = await sq.query(
      `select p.id as "produksiId", p."kodeBatch",p."tanggalRencanaProduksi" ,p."tanggalProduksi",p."tanggalSelesaiProduksi", p."tanggalKadaluarsa", p."kodeProduksi",p."jumlahProduksi",p."realisasiJumlahProduksi",p."statusProduksi",p."formulaId",p."masterUserId",p."gudangId",p."deletedAt" ,p."createdAt" ,sum(sf."jumlahBarangFormula") as "jumlahBarangFormula" from produksi p join formula f on f.id = p."formulaId" join "subFormula" sf on sf."formulaId" = f.id where p."deletedAt" is not null group by(p.id) order by p."deletedAt" `
    );
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listAllActiveProduksi(req, res) {
    let data = await sq.query(`
      select * 
      from produksi p 
      join formula f on f.id = p."formulaId" 
      where p."statusProduksi" = 1 
      and p."deletedAt" isnull 
      and f."deletedAt" isnull `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async detailsBrangByProduksiId(req, res) {
    const { pId } = req.params;
    let data = await sq.query(`select p.id as "produksiId", p."kodeBatch",p."tanggalRencanaProduksi" ,p."tanggalProduksi",p."tanggalSelesaiProduksi", p."tanggalKadaluarsa", p."kodeProduksi",p."jumlahProduksi",p."realisasiJumlahProduksi",p."statusProduksi",p."formulaId",p."masterUserId",p."gudangId",p."deletedAt" ,p."createdAt" ,f."masterBarangId" as "masterBarangId1" ,( select "namaBarang" as "namaBarang1" from "masterBarang" join formula f2 on f2."masterBarangId"="masterBarang".id where f.id = f2.id), sf."masterBarangId",mb."namaBarang", sf."jumlahBarangFormula" as "jumlahBarangFormula",f."keteranganFormula"  from produksi p join formula f on f.id = p."formulaId" join "subFormula" sf on sf."formulaId" = f.id join "masterBarang" mb on mb.id = sf."masterBarangId" 
    where p."deletedAt" isnull and f."isActive" = 1 and sf."deletedAt" isnull and mb."deletedAt" isnull and p."statusProduksi" = 1 and p.id = '${pId}' group by(p.id,f.id, f."masterBarangId" ,sf."masterBarangId" ,mb."namaBarang" ,sf."jumlahBarangFormula", f."keteranganFormula" )  order by p."createdAt"`);
    let isi = "";
    for (let i = 1; i < data[0].length; i++) {
      isi += ` or s."masterBarangId"= '${data[0][i].masterBarangId}'`
    }
    let mBarang = `and (s."masterBarangId"= '${data[0][0].masterBarangId}'${isi})`;
    // console.log(mBarang);
    let stock = await sq.query(`select s.id as "sId", s."jumlahStock", s."tanggalKadaluarsa", s."hargaBeliSatuanStock", s."masterBarangId",s."batchNumber", mb."namaBarang" from stock s
    join "masterBarang" mb on s."masterBarangId" = mb.id where s."deletedAt" isnull and s."jumlahStock" > 0 ${mBarang} order by s."batchNumber", s."createdAt" `)
    // console.log(stock[0].length);
    // console.log(stock[0]);
    // console.log("=======================");
    // console.log(data[0]);

    let hasil = {
      produksiId: data[0][0].produksiId,
      tanggalRencanaProduksi: data[0][0].tanggalRencanaProduksi,
      tanggalProduksi: data[0][0].tanggalProduksi,
      kodeProduksi: data[0][0].kodeProduksi,
      jumlahProduksi: data[0][0].jumlahProduksi,
      realisasiJumlahProduksi: data[0][0].realisasiJumlahProduksi,
      statusProduksi: data[0][0].statusProduksi,
      masterBarangIdProduksi: data[0][0].masterBarangId1,
      namaBarangProduksi: data[0][0].namaBarang1,
      formulaId: data[0][0].formulaId,
      keteranganFormula: data[0][0].keteranganFormula,
      bahan: []
    }
    // console.log(hasil);
    for (let j = 0; j < data[0].length; j++) {
      let x = {
        masterBarangIdBahan: data[0][j].masterBarangId,
        namaBarangBahan: data[0][j].namaBarang,
        jumlahBarangFormula: data[0][j].jumlahBarangFormula,
        batch: []
      };
      for (let k = 0; k < stock[0].length; k++) {
        if (data[0][j].masterBarangId == stock[0][k].masterBarangId) {
          let z = {
            batchNumber: stock[0][k].batchNumber,
            jumlahStock: stock[0][k].jumlahStock
          }
          x.batch.push(z);
        }
      }
      hasil.bahan.push(x);
    }
    res.status(200).json({ status: 200, message: "sukse", data: hasil })
  }
}
module.exports = Controller;

// static async registerSubProduksi(req, res) {
//   const {produksiId,bulksubProduksi} =req.body;
//   let sub = JSON.parse(JSON.stringify(bulksubProduksi));
//   let barang = [];
//   let cekStok = [];
//   let cek = false;
//   let hasil = [];
//   let data = await sq.query(`select sum(s."jumlahStock") as "total", mb."namaBarang", s."masterBarangId" from stock s join "masterBarang" mb on mb.id = s."masterBarangId" where s."deletedAt" isnull and mb."deletedAt" isnull group by s."masterBarangId", mb."namaBarang"`);
//   for (let i = 0; i < sub.length; i++) {
//     for (let j = 0; j < data[0].length; j++) {
//       if(sub[i].masterBarangId == data[0][j].masterBarangId){
//         if(sub[i].jumlahBarang>data[0][j].total){
//           cek= true;
//           cekStok.push({nama:data[0][j].namaBarang,stok:data[0][j].total,order:sub[i].jumlahBarang})
//         }
//       }
//     }
//     barang.push(sub[i].masterBarangId);
//   }
//   if (cek) {
//     res.status(200).json({ status: 200, message: "Stock tidak cukup", data: cekStok });
//   } else {
//     let idBarang = `s."masterBarangId" = '${barang[0]}'`;
//     for (let k = 1; k < barang.length; k++) {
//       idBarang+=` or s."masterBarangId" = '${barang[k]}'`;
//     }
//     let dataBarang = await sq.query(`select * from stock s where s."deletedAt" isnull and (${idBarang}) order by s."tanggalKadaluarsa", s."createdAt"`);
//     for (let l = 0; l < sub.length; l++) {
//       let order = sub[l];
//       // console.log("==================",order);
//       for (let m = 0; m < dataBarang[0].length; m++) {
//         let stok = dataBarang[0][m];
//         if(order.masterBarangId == stok.masterBarangId){
//           if(order.jumlahBarang>0 && stok.jumlahStock>0){
//             // console.log("*****************",stok);
//             let jml = stok.jumlahStock;
//             if(order.jumlahBarang>stok.jumlahStock){
//               stok.jumlahStock -= stok.jumlahStock;
//             }else{
//               stok.jumlahStock-=order.jumlahBarang;
//             }
//             order.jumlahBarang-=jml;
//             if(order.jumlahBarang<=0){
//               order.jumlahBarang=0;
//             }
//             hasil.push({id: stok.id,jumlahStock: stok.jumlahStock,tanggalKadaluarsa: stok.tanggalKadaluarsa,masterBarangId: stok.masterBarangId});
//           }
//         }
//       }
//     }
//     // console.log(hasil);
//     stock.bulkCreate(hasil,{updateOnDuplicate:["jumlahStock"]}).then((data2)=>{
//       let subProduksi = [];
//       for (let n = 0; n < bulksubProduksi.length; n++) {
//         for (let o = 0; o < hasil.length; o++) {
//           let x = {};
//           if(bulksubProduksi[n].masterBarangId == hasil[o].masterBarangId){
//             x["id"] = uuid_v4();
//             x["jumlahBahanProduksi"] = bulksubProduksi[n].jumlahBarang;
//             x["produksiId"] = produksiId;
//             x["masterBarangId"] = bulksubProduksi[n].masterBarangId;
//             x["stockId"] = hasil[o].id;
//             subProduksi.push(x);
//           }
//         }
//       }
//       // console.log(subProduksi);
//       // res.send("oke");
//       subProduksiM.bulkCreate(subProduksi).then((data3)=>{
//         res.status(200).json({status:200,message:"sukses"});
//       }).catch((err)=>{
//         res.status(500).json({status:500,message:"gagal",data:err});
//       });
//     });
//   }
// }
