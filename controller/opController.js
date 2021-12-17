const OP = require("../model/opModel");
const masterBarang = require("../model/masterBarangModel");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");
const moment = require("moment");
const subOP = require("../model/subOPModel");
const masterPiutang = require("../module/masterPiutang/model");
const { DatabaseError } = require("pg-protocol"); 

class Controller {
  static async generateNoOP(req, res) {
    let db = await OP.findAll();
    let acak = moment().format(`ddYYMMDhhmmssms`);
    let nomorOP = `OP${acak}${db.length}`;
    res.status(200).json({ staus: 200, message: "sukses", nomorOP: nomorOP });
  }

  static register(req, res) {
    let { nomorOP, tanggalOrderOP, metodePembayaranOP, TOPPenjualanOP, keteranganPenjualanOP, totalHargaOP, PPNPenjualanOP, masterCustomerId, bulkBarangOP, masterUserId } = req.body;
    const idOP = uuid_v4();
    if (!masterUserId) {
      masterUserId = req.dataUsers.id;
    }
    OP.findAll({ where: { nomorOP } }).then(async (data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "nomorOP sudah ada" });
      } else {
        let barangM = ``;
        let cek = false;
        let cekBarang = []
        for (let i = 1; i < bulkBarangOP.length; i++) {
          barangM += ` or mb.id='${bulkBarangOP[i].masterBarangId}'`;
        }
        let barang = await sq.query(`select * from "masterBarang" mb where mb ."deletedAt" isnull and (mb.id='${bulkBarangOP[0].masterBarangId}'${barangM})`);
        for (let j = 0; j < bulkBarangOP.length; j++) {
          for (let k = 0; k < barang[0].length; k++) {
            if (bulkBarangOP[j].masterBarangId == barang[0][k].id) {
              if (bulkBarangOP[j].jumlahBarangSubOP > barang[0][k].jumlahTotalBarang) {
                cek = true;
                cekBarang.push({ namabarang: barang[0][k].namaBarang, jumlahTotalBarang: barang[0][k].jumlahTotalBarang, Order: bulkBarangOP[j].jumlahBarangSubOP });
              }
              barang[0][k].jumlahTotalBarang -= bulkBarangOP[j].jumlahBarangSubOP;
            }
          }
          bulkBarangOP[j].id = uuid_v4();
          bulkBarangOP[j].OPId = idOP;
        }
        if (cek) {
          res.status(200).json({ status: 200, message: "Stock tidak cukup", data: cekBarang });
        } else {
          OP.create({ id: idOP, nomorOP, tanggalOrderOP, metodePembayaranOP, TOPPenjualanOP, keteranganPenjualanOP, PPNPenjualanOP, totalHargaOP, masterCustomerId, masterUserId }).then((data2) => {
            subOP.bulkCreate(bulkBarangOP).then((data3) => {
              masterBarang.bulkCreate(barang[0], { updateOnDuplicate: ["jumlahTotalBarang"] }).then((data4) => {
                res.status(200).json({ status: 200, message: "sukses" });
              }).catch((err) => {
                console.log("masterBarang", err);
                res.status(500).json({ status: 500, message: "gagal", data: err });
              });
            }).catch((err) => {
              console.log("subOP", err);
              res.status(500).json({ status: 500, message: "gagal", data: err });
            });
          }).catch((err) => {
            console.log("Create", err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
          });
        }
      }
    }).catch((err) => {
      console.log("findAll", err);
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
    // console.log(cek);
    // console.log(cekBarang);
    // console.log(barang[0]);
    // res.send("oke");
  }

  static updateOP(req, res) {
    const { idOP, nomorOP, tanggalOrderOP, metodePembayaranOP, TOPPenjualanOP, keteranganPenjualanOP, PPNPenjualanOP, totalHargaOP, masterCustomerId, masterUserId } = req.body;
    OP.update({ nomorOP, tanggalOrderOP, metodePembayaranOP, TOPPenjualanOP, keteranganPenjualanOP, PPNPenjualanOP, totalHargaOP, masterCustomerId, masterUserId }, { where: { id: idOP } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses" });
    }).catch((err) => {
      console.log("update", err);
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  // static async updateSubOP(req,res){
  //   const {OPId,bulkBarangOP,totalHargaOP} = req.body;

  //   subOP.destroy({where:{OPId}}).then((data)=>{
  //     for (let i = 0; i < bulkBarangOP.length; i++) {
  //       bulkBarangOP[i].id = uuid_v4();
  //       bulkBarangOP[i].OPId = OPId;
  //     }
  //     subOP.bulkCreate(bulkBarangOP).then((data2)=>{
  //       OP.update({totalHargaOP},{where:{id:OPId}}).then((data3)=>{
  //         res.status(200).json({status:200,message:"sukses"});
  //       }).catch((err)=>{
  //         console.log("OP");
  //         res.status(500).json({ status: 500, message: "gagal", data: err });
  //       });
  //     }).catch((err)=>{
  //       console.log("Bulk");
  //       res.status(500).json({ status: 500, message: "gagal", data: err });
  //     });
  //   }).catch((err)=>{
  //     console.log("destroy");
  //     res.status(500).json({ status: 500, message: "gagal", data: err });
  //   });
  // }

  static updateSubOP(req, res) {
    const { OPId, bulkBarangOP, totalHargaOP } = req.body;
    subOP.findAll({ where: { OPId }, raw: true }).then(async (data) => {
      if (data.length == 0) {
        res.status(200).json({ status: 200, message: "Data tidak ada" });
      } else {
        let barangB = ``;
        let mBarang = ``;
        let cek = false;
        let cekBarang = [];
        for (let i = 0; i < bulkBarangOP.length; i++) {
          if (i > 0) {
            barangB += ` or mb.id='${bulkBarangOP[i].masterBarangId}'`;
          }
          bulkBarangOP[i].id = uuid_v4();
          bulkBarangOP[i].OPId = OPId;
        }
        for (let j = 1; j < data.length; j++) {
          mBarang += ` or mb.id='${data[j].masterBarangId}'`;
        }
        let bulk = await sq.query(`select * from "masterBarang" mb where mb ."deletedAt" isnull and (mb.id='${bulkBarangOP[0].masterBarangId}'${barangB})`);
        let barangM = await sq.query(`select * from "masterBarang" mb where mb ."deletedAt" isnull and (mb.id='${data[0].masterBarangId}'${mBarang})`);
        let mB = [...barangM[0], ...bulk[0]];
        let tmp = [...new Map(mB.map(item => [item['id'], item])).values()];
        for (let k = 0; k < tmp.length; k++) {
          for (let l = 0; l < data.length; l++) {
            if (tmp[k].id == data[l].masterBarangId) {
              tmp[k].jumlahTotalBarang += data[l].jumlahBarangSubOP;
            }
          }
          for (let m = 0; m < bulkBarangOP.length; m++) {
            if (bulkBarangOP[m].masterBarangId == tmp[k].id) {
              if (bulkBarangOP[m].jumlahBarangSubOP > tmp[k].jumlahTotalBarang) {
                cek = true;
                cekBarang.push({ namaBarang: tmp[k].namaBarang, jumlahStock: tmp[k].jumlahTotalBarang, jumlahOrder: bulkBarangOP[m].jumlahBarangSubOP });
              }
              tmp[k].jumlahTotalBarang -= bulkBarangOP[m].jumlahBarangSubOP;
            }
          }
        }
        if (cek) {
          res.status(200).json({ status: 200, message: "Stock tidak cukup", data: cekBarang });
        } else {
          subOP.destroy({ where: { OPId } }).then((data2) => {
            subOP.bulkCreate(bulkBarangOP).then((data3) => {
              OP.update({ totalHargaOP }, { where: { id: OPId } }).then((data4) => {
                masterBarang.bulkCreate(tmp, { updateOnDuplicate: ['jumlahTotalBarang'] }).then((data5) => {
                  res.status(200).json({ status: 200, message: "sukses" });
                }).catch((err) => {
                  console.log("MB", err);
                  res.status(500).json({ status: 500, message: "gagal", data: err });
                });
              }).catch((err) => {
                console.log("update", err);
                res.status(500).json({ status: 500, message: "gagal", data: err });
              });
            }).catch((err) => {
              console.log("bulk", err);
              res.status(500).json({ status: 500, message: "gagal", data: err });
            });
          }).catch((err) => {
            console.log("destroy", err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
          });
        }
        // console.log("======== tmp");
        // console.log(tmp);
        // console.log("======== cekBarang");
        // console.log(cekBarang);
        // console.log("======== bulk");
        // console.log(bulk[0]);
        // console.log("======== barangM[0]");
        // console.log(barangM[0]);
        // res.send("oke")
      }
    }).catch((err) => {
      console.log("find-all", err);
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static async listBarangOPByNoOP(req,res){
    const { nomorOP, kategoriHargaId } = req.body;
    // let data = await sq.query(`select so.id as "subOPId",so."jumlahBarangSubOP", so."hargaBeliOP",so."totalHargaPerBarangOP",so."OPId",o."nomorOP",so."masterBarangId",mb."namaBarang",mb.barcode,mb."kodeBarang",mb."jumlahTotalBarang",o."totalHargaOP", o."statusOP",mkh."kategoriToko",phj."hargaJual",(select sum(s."jumlahStock") as "totalStock" from stock s where s."deletedAt" isnull and s."masterBarangId"=mb.id) from "subOP" so join "masterBarang" mb on mb.id = so."masterBarangId" join "OP" o on o.id = so."OPId" join "poolHargaJual" phj on phj."masterBarangId" = mb.id join "masterKategoriHarga" mkh on mkh.id = phj."masterKategoriHargaId" where so."deletedAt" isnull and o."deletedAt" isnull and mb."deletedAt" isnull and o."nomorOP" = '${nomorOP}' and phj."masterKategoriHargaId" = '${kategoriHargaId}' order by so."createdAt" `);
    let data = await sq.query(`select so.id as "subOPId",so."jumlahBarangSubOP", so."hargaBeliOP",so."totalHargaPerBarangOP",so."OPId",o."nomorOP",so."masterBarangId",mb."namaBarang",mb.barcode,mb."kodeBarang",mb."jumlahTotalBarang",o."totalHargaOP", o."statusOP",mkh."kategoriToko",phj."hargaJual",(select sum(s."jumlahStock") as "totalStock" from stock s where s."deletedAt" isnull and s."masterBarangId"=mb.id),(select sum(so2."jumlahBarangSubOP") as "jumlahTotalSubOP" from "subOP" so2 join "OP" o2 on o2.id=so2."OPId" where so2."deletedAt" isnull and o2."deletedAt" isnull and o2.id=o.id) from "subOP" so join "OP" o ON o.id = so."OPId" join "masterBarang" mb ON mb.id = so."masterBarangId" join "masterCustomer" mc on mc.id = o."masterCustomerId" join "poolHargaJual" phj on phj ."masterBarangId" = mb.id join "masterKategoriHarga" mkh on mkh.id = phj."masterKategoriHargaId" where so."deletedAt" isnull and mb."deletedAt" isnull and o."deletedAt" isnull and  mb."deletedAt" isnull and mc."deletedAt" isnull and phj."deletedAt" isnull and mkh."deletedAt" isnull and o."nomorOP" = '${nomorOP}' and phj."masterKategoriHargaId" = '${kategoriHargaId}' order by so."createdAt"`);
    let TOP = await sq.query(`select sto.id  as "subTransaksiOPId",sto."jumlahBarangOP",sto."hargaJualOP",sto."isBonus",sto."hargaTotalOP",sto."transaksiOPId",to2."nomorDO",sto."stockId",to2."OPId",o."nomorOP" from "subTransaksiOP" sto join "transaksiOP" to2 on to2.id = sto."transaksiOPId" join "OP" o on o.id = to2."OPId" where sto."deletedAt" isnull and to2."deletedAt" isnull and to2."pembatalanTransaksiOP" isnull and o."deletedAt" isnull and o."nomorOP" = '${nomorOP}'`);

    // console.log(data[0]);
    // console.log("==================================");
    // console.log(TOP[0]);
    let jmlBonus = 0;
    let jmlBarang = 0;
    for (let i = 0; i < TOP[0].length; i++) {
      if(TOP[0].isBonus){
        jmlBonus+=TOP[0][i].jumlahBarangOP;
      }else{
        jmlBarang+=TOP[0][i].jumlahBarangOP
      }
    }
    // console.log(jmlBonus);
    // console.log(jmlBarang);
    for (let j = 0; j < data[0].length; j++) {
      data[0][j].TotalBarangTransaksiOP = jmlBarang;
      data[0][j].TotalBarangBonusTransaksiOP = jmlBonus;
    }
    // console.log(data[0]);
    res.status(200).json({status:200,message:"sukses",data:data[0]})
  }

  static async list(req, res) {
    // const data = await sq.query(`select o.id as "OPId", o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP" ,o."totalHargaOP",sum(so."jumlahBarangSubOP") as "totalBarangSubOP",mc."namaCustomer",mu.nama as "namaUser" from "subOP" so join "OP" o ON so."OPId" = o.id join "masterCustomer" mc on mc.id = o."masterCustomerId"
    // join "masterUser" mu on mu.id = o."masterUserId" where so."deletedAt" isnull and o."deletedAt" isnull and mc."deletedAt" isnull and mu."deletedAt" isnull group by(o.id,o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP" ,o."totalHargaOP",so."OPId",mc."namaCustomer",mu.nama)`);
    let data = await sq.query(`select o.id as "OPId",o."masterCustomerId",o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP",o."totalHargaOP",o."statusOP",sum(so."jumlahBarangSubOP") as "totalBarangSubOP",mc."namaCustomer",o."masterUserId", mu.nama as "namaUser" from "subOP" so join "OP" o ON so."OPId" = o.id join "masterCustomer" mc on mc.id = o."masterCustomerId" join "masterUser" mu on mu.id = o."masterUserId" where so."deletedAt" isnull and o."deletedAt" isnull and mc."deletedAt" isnull and mu."deletedAt" isnull group by(o.id,o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP" ,o."totalHargaOP",so."OPId",mc."namaCustomer",mu.nama) order by o."createdAt"`);
    // let sales = await sq.query(
    //   `select mu.id as "UserID" ,mu.nama ,mu."NIP" ,mu."role", mu.email from "masterUser" mu  where mu."deletedAt" isnull`
    // );
    // let hasil = data[0];
    // let x = sales[0];

    // for (let i = 0; i < hasil.length; i++) {
    //   for (let j = 0; j < x.length; j++) {
    //     if (hasil[i].masterSalesId == x[j].UserID) {
    //       hasil[i].namaSales = x[j].nama;
    //       hasil[i].NIPSales = x[j].NIP;
    //     }
    //   }
    // }
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
  static async listOPBySales(req, res) {
    const { masterUserId } = req.body;
    let data = await sq.query(`select * from "OP" o join "masterUser" mu on mu.id = o."masterUserId" where o."deletedAt" isnull and mu."deletedAt" isnull and mu.id = '${masterUserId}'`)
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
  static async detailsOPByNoOP(req, res) {
    const { nomorOP } = req.params;
    // console.log(nomorOP);
    let data = await sq.query(`select * from "OP" o join "masterCustomer" mc on mc.id = o."masterCustomerId" join "masterUser" mu on mu.id = o."masterUserId" where o."deletedAt" isnull and mc."deletedAt" isnull and mu."deletedAt" isnull and o."nomorOP" = '${nomorOP}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async pendingOrder(req, res) {
    let data = await sq.query(`
      select o.id as "OPId", o."nomorOP" ,mc."namaCustomer",mu.id as "masterUserId", mu.nama as "namaSales" 
      from "OP" o 
      join "masterCustomer" mc on mc.id = o."masterCustomerId" 
      join "masterUser" mu on mu.id = o."masterUserId" 
      left join "transaksiOP" to2 on to2."OPId" = o.id 
      where to2."nomorDO" isnull 
      and o."deletedAt" isnull 
      and mc."deletedAt" isnull 
      and mu."deletedAt" isnull`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listAllPencapaianSales(req, res) {
    let data = await sq.query(`
      select mu.nama as "namaSales", 
      (select count (mc2.id) as "jumlahCustomer" from "masterCustomer" mc2 where mc2."masterUserId" = mu.id),
      (select count(mc3.id) as "jumlahCustomerSudahOrder" 
        from "OP" o 
        join "masterCustomer" mc3 on mc3.id = o."masterCustomerId" 
        join "masterUser" mu2 on mu2.id = o."masterUserId" 
        where mu.id = mu2.id 
        and mc3."masterUserId" = mu2.id 
        and o."tanggalOrderOP" between '2021-11-01' and '2021-11-30' 
        and o."deletedAt" isnull) 
      from "masterUser" mu 
      join "masterCustomer" mc on mc."masterUserId" = mu.id 
      where mu."deletedAt" isnull 
      and mc."deletedAt" isnull 
      group by (mu.id,mu.nama)`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listAllPenjualanHariIni(req, res) {
    let tgl = await sq.query(`select current_date`);
    let tanggal = moment(tgl[0][0].current_date).format('YYYY-MM-DD')
    let t = new Date(tanggal);
    console.log(t)
    console.log(typeof(t));
    
    let data = await sq.query(`
    select o.id as "OPId",o."masterCustomerId",o."nomorOP" ,o."tanggalOrderOP",o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP",o."totalHargaOP",sum(so."jumlahBarangSubOP") as "totalBarangSubOP",mc."namaCustomer",o."masterUserId", mu.nama as "namaUser" 
      from "subOP" so join "OP" o ON so."OPId" = o.id 
      join "masterCustomer" mc on mc.id = o."masterCustomerId"
      join "masterUser" mu on mu.id = o."masterUserId" 
      where so."deletedAt" isnull 
      and o."deletedAt" isnull 
      and mc."deletedAt" isnull 
      and mu."deletedAt" isnull 
      and date(o."tanggalOrderOP") = (select current_date)
      group by(o.id,o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP" ,o."totalHargaOP",so."OPId",mc."namaCustomer",mu.nama)
      `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listAllPenjualanSatuBulan(req, res) {
    let bln = await sq.query(
      `SELECT EXTRACT(MONTH FROM current_date) as "bulan"`
    );
    let bulan = bln[0][0].bulan;
    let thn = await sq.query(
      `SELECT EXTRACT(YEAR FROM current_date) as "tahun"`
    );
    let tahun = thn[0][0].tahun;
    let tanggalAwal = `${tahun}-${bulan}-01`;
    let tglAkhir = await sq.query(
      `select date(date('${tanggalAwal}') + interval '1 month' - interval '1 days') as "tglAkhir"`
    );
    let tanggalAkhir = tglAkhir[0][0].tglAkhir;

    let tgl = await sq.query(
      `select date::date as "tanggal" from generate_series('${tanggalAwal}'::date,'${tanggalAkhir}'::date,'1 day'::interval) as date`
    );
    let tanggal = tgl[0];

    let dO = await sq.query(`
      select date(o."tanggalOrderOP") , sum(o."totalHargaOP") as "jumlah"
      from "OP" o 
      where o."statusOP" = 1 
      group by date(o."tanggalOrderOP") 
      order by date(o."tanggalOrderOP") `);
    let dataOP = dO[0];

    // for (let i = 0; i < tanggal.length; i++) {
    //   for (let j = 0; j < dataOP.length; j++) {
    //     if (tanggal[i].tanggal === dataOP[j].date) {
    //       tanggal[i].jumlah = dataOP[j].jumlah
    //     } else {
    //       tanggal[i].jumlah = null
    //     }
    //   }
    // }
    let data = await sq.query(`
      select date(d) as "tanggal", sum(o."totalHargaOP") as "jumlah"
      from generate_series(
        timestamp without time zone '${tanggalAwal}' ,
        timestamp without time zone '${tanggalAkhir}' ,
        '1 day'::interval
      ) d 
      left join "OP" o on date(o."tanggalOrderOP") = d 
      group by "tanggal" order by "tanggal";`);

    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static acceptedOP(req, res) {
    const { idOP, statusOP, piutangAwal, sisaPiutang, TOPPiutang, statusPiutang } = req.body;
    OP.update({ statusOP }, { where: { id: idOP } }).then((data2) => {
      if (statusOP == 1) {
        masterPiutang.create({id: uuid_v4(),piutangAwal, sisaPiutang, TOPPiutang, statusPiutang, OPId: idOP})
        .then((data2) => {
          res.status(200).json({ status: 200, message: "sukses" });
        })
      }
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static async listByStatusOP(req, res) {
    const { statusOP } = req.params;
    let data = await sq.query(`select o.id as "OPId",o."masterCustomerId",o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP",o."totalHargaOP",o."statusOP",sum(so."jumlahBarangSubOP") as "totalBarangSubOP",mc."namaCustomer",o."masterUserId", mu.nama as "namaUser", mc."masterKategoriHargaId" from "subOP" so join "OP" o ON so."OPId" = o.id join "masterCustomer" mc on mc.id = o."masterCustomerId" join "masterUser" mu on mu.id = o."masterUserId" join "masterKategoriHarga" mkh on mkh.id = mc."masterKategoriHargaId" where so."deletedAt" isnull and o."deletedAt" isnull and mc."deletedAt" isnull and mu."deletedAt" isnull and o."statusOP"=${statusOP} group by(o.id,o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP" ,o."totalHargaOP",so."OPId",mc."namaCustomer",mu.nama, mc."masterKategoriHargaId") order by o."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listAllLaporanOP(req, res) {
    let op = await sq.query(`select o.id as "opId", o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."masterUserId" ,mu.nama ,mu."NIP" ,o."masterCustomerId" ,mc."namaCustomer", so."masterBarangId",mb."namaBarang",so."jumlahBarangSubOP" ,so."hargaBeliOP" ,so."totalHargaPerBarangOP" ,o."statusOP" ,o."totalHargaOP",o."createdAt" ,o."deletedAt" from "OP" o join "masterCustomer" mc on mc.id = o."masterCustomerId" join "masterUser" mu on mu.id = o."masterUserId" join "subOP" so on so."OPId" = o.id join "masterBarang" mb on mb.id = so."masterBarangId" where o."deletedAt" isnull and mc."deletedAt" isnull and mu."deletedAt" isnull and so."deletedAt" isnull and (o."statusOP" = 2 or o."statusOP" = 3 ) order by o."createdAt"`);
    let transOP = await sq.query(`select to2.id as "transaksiOPId",to2 ."namaPengirimOP", to2."nomorDO",to2."tanggalPengirimanOP", to2 ."OPId", to2."masterUserId",to2."statusTransaksiOP",s."masterBarangId" ,s."batchNumber" ,sto."jumlahBarangOP",sto."hargaJualOP" ,sto."hargaTotalOP",sto."isBonus",(select sum(sto2."hargaTotalOP") as "totalInvoice" from "subTransaksiOP" sto2 where sto2."deletedAt" isnull and sto2 ."transaksiOPId" = to2.id group by sto2."transaksiOPId") from "transaksiOP" to2 join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id join stock s on sto."stockId" = s.id where to2."deletedAt" isnull and sto."deletedAt" isnull and to2."statusTransaksiOP" = 1 order by to2."createdAt" `); // status 2 dan 3
    let hasil = [];
    // console.log(op[0]);
    // console.log("==========================");
    // console.log(transOP[0]);

    for (let i = 0; i < transOP[0].length; i++) {
      for (let j = 0; j < op[0].length; j++) {
        let x = {};
        if (transOP[0][i].OPId == op[0][j].opId) {
          if (transOP[0][i].masterBarangId == op[0][j].masterBarangId) {
            x["noDO"] = transOP[0][i].nomorDO;
            x["tanggalPenjualan"] = op[0][j].tanggalOrderOP;
            x["noOP"] = op[0][j].nomorOP;
            x["namaCustomer"] = op[0][j].namaCustomer;
            x["pembayaran"] = op[0][j].metodePembayaranOP;
            x["sales"] = op[0][j].nama;
            x["namaBarang"] = op[0][j].namaBarang;
            x["statusBarang"] = transOP[0][i].isBonus;
            x["qty"] = transOP[0][i].jumlahBarangOP;
            x["hargaJual"] = transOP[0][i].hargaJualOP;
            x["totalJual"] = transOP[0][i].hargaTotalOP;
            x["totalInvoice"] = transOP[0][i].totalInvoice;
            hasil.push(x);
          }
        }
      }
    }
    for (let k = 0; k < hasil.length; k++) {
      if (k > 0 && hasil[k].noDO == hasil[k - 1].noDO) {
        hasil[k].totalInvoice = null;
      }
    }
    // console.log(hasil);
    // console.log(op[0]);
    // console.log("=============================");
    // console.log(transOP[0]);
    res.status(200).json({ status: 200, message: "sukses", data: hasil });
  }

  static async searchLaporanOP(req, res) {
    const { idCustomer, tglAwal, tglAkhir } = req.body;
    let isi = "";
    let ext;
    if (!idCustomer && !tglAwal && !tglAkhir) {
      ext = "";
    } else {
      if (!idCustomer && tglAwal && tglAkhir) {
        isi += `o."tanggalOrderOP" between '${tglAwal}' and '${tglAkhir}'`;
      } else if (idCustomer && !tglAwal && !tglAkhir) {
        isi += `mc.id = '${idCustomer}'`;
      } else {
        isi += `mc.id = '${idCustomer}' and o."tanggalOrderOP" between '${tglAwal}' and '${tglAkhir}'`;
      }
      ext = `and ${isi}`;
    }

    // console.log(ext);
    // console.log("isi",isi);

    let op = await sq.query(`select o.id as "opId", o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."masterUserId" ,mu.nama ,mu."NIP" ,o."masterCustomerId" ,mc."namaCustomer", so."masterBarangId",mb."namaBarang",so."jumlahBarangSubOP" ,so."hargaBeliOP" ,so."totalHargaPerBarangOP" ,o."statusOP" ,o."totalHargaOP",o."createdAt" ,o."deletedAt" from "OP" o join "masterCustomer" mc on mc.id = o."masterCustomerId" join "masterUser" mu on mu.id = o."masterUserId" join "subOP" so on so."OPId" = o.id join "masterBarang" mb on mb.id = so."masterBarangId" where o."deletedAt" isnull and mc."deletedAt" isnull and mu."deletedAt" isnull and so."deletedAt" isnull and (o."statusOP" = 2 or o."statusOP" = 3 )${ext} order by o."createdAt"`);
    let transOP = await sq.query(`select to2.id as "transaksiOPId",to2 ."namaPengirimOP", to2."nomorDO",to2."tanggalPengirimanOP", to2 ."OPId", to2."masterUserId",to2."statusTransaksiOP",s."masterBarangId" ,s."batchNumber" ,sto."jumlahBarangOP",sto."hargaJualOP" ,sto."hargaTotalOP",sto."isBonus",(select sum(sto2."hargaTotalOP") as "totalInvoice" from "subTransaksiOP" sto2 where sto2."deletedAt" isnull and sto2 ."transaksiOPId" = to2.id group by sto2."transaksiOPId") from "transaksiOP" to2 join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id join stock s on sto."stockId" = s.id where to2."deletedAt" isnull and sto."deletedAt" isnull and to2."statusTransaksiOP" = 1 order by to2."createdAt" `);
    let hasil = [];

    for (let i = 0; i < transOP[0].length; i++) {
      for (let j = 0; j < op[0].length; j++) {
        let x = {};
        if (op[0][j].opId == transOP[0][i].OPId) {
          if (op[0][j].masterBarangId == transOP[0][i].masterBarangId) {
            x["noDO"] = transOP[0][i].nomorDO;
            x["tanggalPenjualan"] = op[0][j].tanggalOrderOP;
            x["noOP"] = op[0][j].nomorOP;
            x["namaCustomer"] = op[0][j].namaCustomer;
            x["pembayaran"] = op[0][j].metodePembayaranOP;
            x["sales"] = op[0][j].nama;
            x["namaBarang"] = op[0][j].namaBarang;
            x["statusBarang"] = transOP[0][i].isBonus;
            x["qty"] = transOP[0][i].jumlahBarangOP;
            x["hargaJual"] = transOP[0][i].hargaJualOP;
            x["totalJual"] = transOP[0][i].hargaTotalOP;
            x["totalInvoice"] = transOP[0][i].totalInvoice;
            hasil.push(x);
          }
        }
      }
    }
    for (let k = 0; k < hasil.length; k++) {
      if (k > 0 && hasil[k].noDO == hasil[k - 1].noDO) {
        hasil[k].totalInvoice = null;
      }
    }
    // console.log(hasil);
    // console.log(op[0])j
    // console.log("=============================");
    // console.log(transOP[0]);
    res.status(200).json({ status: 200, message: "sukses", data: hasil });
  }

  static async grafikPenjualanPertahun(req,res){
    const{tahun}= req.params
    let data = await sq.query(`select date_part('month',o."tanggalOrderOP") as bulan ,sum(o."totalHargaOP") from "OP" o where date_part('year',o."tanggalOrderOP") = ${tahun} and o."deletedAt" isnull group by bulan `) 
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
  
}

module.exports = Controller;



// static async register(req, res) {
//   let {nomorOP,tanggalOrderOP,metodePembayaranOP,TOPPenjualanOP,keteranganPenjualanOP,totalHargaOP,PPNPenjualanOP,masterCustomerId,bulkBarangOP,masterUserId} = req.body;
//   const idOP = uuid_v4();
//   let barangM = ``;
//   if (!masterUserId) {
//     masterUserId = req.dataUsers.id;
//   }
//   OP.findAll({ where: { nomorOP } }).then((data) => {
//     if (data.length) {
//       res.status(200).json({ status: 200, message: "nomorOP sudah ada" });
//     } else {
//       OP.create({id: idOP,nomorOP,tanggalOrderOP,metodePembayaranOP,TOPPenjualanOP,keteranganPenjualanOP,PPNPenjualanOP,totalHargaOP,masterCustomerId,masterUserId}).then(async (data2) => {
//         for (let i = 0; i < bulkBarangOP.length; i++) {
//           const idBulk = uuid_v4();
//           bulkBarangOP[i].id = idBulk;
//           bulkBarangOP[i].OPId = idOP;
//           if (i > 0) {
//             barangM += ` or mb.id='${bulkBarangOP[i].masterBarangId}'`;
//           }
//         }
//         let barang = await sq.query(`select * from "masterBarang" mb where mb ."deletedAt" isnull and (mb.id='${bulkBarangOP[0].masterBarangId}'${barangM})`);
//         subOp.bulkCreate(bulkBarangOP).then((data3) => {
//           for (let i = 0; i < barang[0].length; i++) {
//             for (let j = 0; j < bulkBarangOP.length; j++) {
//               if (barang[0][i].id == bulkBarangOP[j].masterBarangId) {
//                 barang[0][i].jumlahTotalBarang -= bulkBarangOP[j].jumlahBarangSubOP;
//                 if(barang[0][i].jumlahTotalBarang<0){
//                   barang[0][i].jumlahTotalBarang=0
//                 }
//               }
//             }
//           }
//           masterBarang.bulkCreate(barang[0], {updateOnDuplicate: ["jumlahTotalBarang"]}).then((data3) => {
//               res.status(200).json({ status: 200, message: "sukses" });
//             }).catch((err) => {
//               res.status(500).json({ status: 500, message: "gagal", data: err });
//             });
//         });
//       });
//     }
//   });
// }

// static async listBarangOPByNoOP(req, res) {
  //   const { nomorOP, kategoriHargaId } = req.body;

  //   let data = await sq.query(`select so.id as "subOPId",so."jumlahBarangSubOP", so."hargaBeliOP",so."totalHargaPerBarangOP",so."OPId",o."nomorOP",so."masterBarangId",mb."namaBarang",mb.barcode,mb."kodeBarang",mb."jumlahTotalBarang",o."totalHargaOP", o."statusOP",mkh."kategoriToko",phj."hargaJual",(select sum(s."jumlahStock") as "totalStock" from stock s where s."deletedAt" isnull and s."masterBarangId"=mb.id) from "subOP" so join "masterBarang" mb on mb.id = so."masterBarangId" join "OP" o on o.id = so."OPId" join "poolHargaJual" phj on phj."masterBarangId" = mb.id join "masterKategoriHarga" mkh on mkh.id = phj."masterKategoriHargaId" where so."deletedAt" isnull and o."deletedAt" isnull and mb."deletedAt" isnull and o."nomorOP" = '${nomorOP}' and phj."masterKategoriHargaId" = '${kategoriHargaId}' order by so."createdAt" `);
    // let data1 =await sq.query(`select so.id as "subOPId",so."hargaBeliOP", so."totalHargaPerBarangOP" ,so."OPId",o."nomorOP",o."tanggalOrderOP",o."totalHargaOP", so."masterBarangId",mb."namaBarang", mb.barcode,mb."kodeBarang" ,mb."hargaSatuanBesar",mb."hargaSatuanKecil" ,so."jumlahBarangSubOP",
    // (select sum(s."jumlahStock") as "jumlahStock" from stock s where s."masterBarangId" = mb.id group by s."masterBarangId") 
    // from "subOP" so left join "masterBarang" mb on mb.id = so."masterBarangId" left join "OP" o on o.id = so."OPId" 
    // where o."deletedAt" isnull and so."deletedAt" isnull and mb."deletedAt" isnull and o."nomorOP" ='${nomorOP}' order by so."createdAt" `);

    // let data = await sq.query(`
    //   select o.id as "OPId", o."nomorOP" , o."tanggalOrderOP" , o."totalHargaOP" ,
    //   mb.id as "masterBarangId", mb."namaBarang" , mb.barcode , mb.foto ,mb."kodeBarang" ,
    //   mb."hargaSatuanBesar" ,mb."hargaSatuanKecil",so."jumlahBarangSubOP"
    //   from "OP" o
    //   join "subOP" so on so."OPId" = o.id
    //   join "masterBarang" mb on mb.id = so."masterBarangId"
    //   where o."deletedAt" isnull and so."deletedAt" isnull and mb."deletedAt" isnull and  o."nomorOP" = '${nomorOP}'`);

    // let stok = await sq.query(`select mb.id as "masterBarangId",  mb."namaBarang" , sum(s."jumlahStock")as "jumlahStock" from stock s join "masterBarang" mb ON mb.id = s."masterBarangId"
    // where s."deletedAt" isnull and mb."deletedAt" isnull
    // group by (s."jumlahStock",mb."namaBarang",mb.id)`);

    // let x = data[0];
    // let y = stok[0];
    // for (let i = 0; i < x.length; i++) {
    //   for (let j = 0; j < y.length; j++) {
    //     if(x[i].masterBarangId == y[j].masterBarangId)
    //     {
    //       x[i].jumlahStock =  y[j].jumlahStock
    //     }
    //   }
    // }
    // res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  // }