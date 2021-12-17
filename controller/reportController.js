const sq = require("../config/connection");
const ExcelJS = require("exceljs");
const moment = require("moment");

class Controller {
  // static async reportsByNomorPO(req, res) {
  //   const { nomorPO } = req.params;
  //   let data = await sq.query(
  //     `select * from "subPO" sp join "PO" p ON p.id = sp."POId" join "masterBarang" mb on mb.id = sp."masterBarangId" join "masterSupplier" ms on ms.id = p."masterSupplierId" where sp."deletedAt" isnull and p."deletedAt" isnull and mb."deletedAt" isnull and ms."deletedAt" isnull and p."nomorPO" = '${nomorPO}'`
  //   );
  //   // res.status(200).JSON({status:200,message:"sukses",data:data[0]});
  //   // res.render('reportPO.ejs',{data: JSON.stringify(data[0])});
  //   // console.log(data[0]);
  //   const workbook = new ExcelJS.Workbook();
  //   const sheet = workbook.addWorksheet("Serova");

  //   let c = [
  //     { header: "Jumlah", key: "jumlah", width: 10 },
  //     { header: "Harga Beli", key: "hargaBeli", width: 10 },
  //   ];
  //   // console.log(x);
  //   sheet.columns = c;
  //   let isi = [
  //     { jumlah: 200, hargaBeli: 50000 },
  //     { jumlah: 70, hargaBeli: 900 },
  //   ];

  //   for (let i = 0; i < isi.length; i++) {
  //     sheet.addRow(isi[i]);
  //   }

  //   sheet.getCell("A1").border = {
  //     top: { style: "thick" },
  //     left: { style: "thick" },
  //     bottom: { style: "thick" },
  //     right: { style: "thick" },
  //   };

  //   let fileName = "coba.xlsx";
  //   res.setHeader(
  //     "Content-Type",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //   );
  //   res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
  //   await workbook.xlsx.write(res);
  //   res.end();
  // }

  static async reportCustomer(req, res) {
    // const {val}= req.params;
    // let hasil = `and mc."namaCustomer" ilike '${val}%'`
    // if(val.toLowerCase()=="all"){
    // 	hasil="";
    // }
    // let data = await sq.query(`select mc.id as "masterCustomerId", mc."namaCustomer" ,mp.nama as "namaPIC" ,mkc."namaKategori" as "namaKategoriCustomer" ,mp."nomorIdentitas" ,mp."nomorTelepon" ,mb."namaBank" ,mb."nomorRekening" from "masterCustomer" mc
    // join "masterPic" mp on mp."masterCustomerId" = mc.id
    // join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId"
    // join "masterBank" mb on mb."masterCustomerId" = mc.id
    // where mc."deletedAt" isnull and mp."deletedAt" isnull and mkc."deletedAt" isnull and mb."deletedAt" isnull ${hasil} order by mc."createdAt" `);
    let data = await sq.query(`
        select mc."namaCustomer" ,mp.nama as "namaPIC" ,mkc."namaKategori" as "namaKategoriCustomer" ,mp."nomorIdentitas" ,mp."nomorTelepon" ,mb."namaBank" ,mb."nomorRekening" 
        from "masterCustomer" mc 
        join "masterPic" mp on mp."masterCustomerId" = mc.id 
        join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId" 
        join "masterBank" mb on mb."masterCustomerId" = mc.id 
        where mc."deletedAt" isnull 
        and mp."deletedAt" isnull 
        and mkc."deletedAt" isnull 
        and mb."deletedAt" isnull `);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Serova");

    let c = [
      { header: "Nama Customer", key: "namaCustomer", width: 10 },
      { header: "Nama PIC", key: "namaPIC", width: 10 },
      { header: "Kategori Customer", key: "namaKategoriCustomer", width: 10 },
      { header: "Nomor Identitas", key: "nomorIdentitas", width: 10 },
      { header: "Nomor Telepon", key: "nomorTelepon", width: 10 },
      { header: "Nama Bank", key: "namaBank", width: 10 },
      { header: "Nomor Rekening", key: "nomorRekening", width: 10 },
    ];
    // console.log(x);
    sheet.columns = c;
    let isi = data[0];

    for (let i = 0; i < isi.length; i++) {
      sheet.addRow(isi[i]);
    }

    let fileName = "customer.xlsx";
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    await workbook.xlsx.write(res);
    res.end();
  }

  static async reportAllPenjualan(req, res) {
    let op = await sq.query(`select o.id as "opId", o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."masterUserId" ,mu.nama ,mu."NIP" ,o."masterCustomerId" ,mc."namaCustomer", so."masterBarangId",mb."namaBarang",so."jumlahBarangSubOP" ,so."hargaBeliOP" ,so."totalHargaPerBarangOP" ,o."statusOP" ,o."totalHargaOP",o."createdAt" ,o."deletedAt" from "OP" o join "masterCustomer" mc on mc.id = o."masterCustomerId" join "masterUser" mu on mu.id = o."masterUserId" join "subOP" so on so."OPId" = o.id join "masterBarang" mb on mb.id = so."masterBarangId" where o."deletedAt" isnull and mc."deletedAt" isnull and mu."deletedAt" isnull and so."deletedAt" isnull and (o."statusOP" = 2 or o."statusOP" = 3 ) order by o."createdAt"`);
    let transOP = await sq.query(`select to2.id as "transaksiOPId",to2 ."namaPengirimOP", to2."nomorDO",to2."tanggalPengirimanOP", to2 ."OPId", to2."masterUserId",to2."statusTransaksiOP",s."masterBarangId" ,s."batchNumber" ,sto."jumlahBarangOP",sto."hargaJualOP" ,sto."hargaTotalOP",sto."isBonus",(select sum(sto2."hargaTotalOP") as "totalInvoice" from "subTransaksiOP" sto2 where sto2."deletedAt" isnull and sto2 ."transaksiOPId" = to2.id group by sto2."transaksiOPId") from "transaksiOP" to2 join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id join stock s on sto."stockId" = s.id where to2."deletedAt" isnull and sto."deletedAt" isnull and to2."statusTransaksiOP" = 1 order by to2."createdAt" `); // status 2 dan 3
    // let op =
    //   await sq.query(`select o.id as "opId", o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."masterUserId" ,mu.nama ,mu."NIP" ,o."masterCustomerId" ,mc."namaCustomer", so."masterBarangId",mb."namaBarang",so."jumlahBarangSubOP" ,so."hargaBeliOP" ,so."totalHargaPerBarangOP" ,o."statusOP" ,o."totalHargaOP",o."createdAt" ,o."deletedAt" 
    // from "OP" o 
    // join "masterCustomer" mc on mc.id = o."masterCustomerId"
    // join "masterUser" mu on mu.id = o."masterUserId" 
    // join "subOP" so on so."OPId" = o.id 
    // join "masterBarang" mb on mb.id = so."masterBarangId" 
    // where o."deletedAt" isnull and mc."deletedAt" isnull and mu."deletedAt" isnull and so."deletedAt" isnull and o."statusOP" = 2 or o."statusOP" = 3 order by o."createdAt"`);

    // let transOP =
    //   await sq.query(`select to2.id as "transaksiOPId",to2 ."namaPengirimOP", to2."nomorDO",to2."tanggalPengirimanOP", to2 ."OPId", to2."masterUserId",to2."statusTransaksiOP", s."masterBarangId" ,s."batchNumber" ,sto."jumlahBarangOP",sto."hargaJualOP" ,sto."hargaTotalOP",sto."isBonus",(select sum(sto2."hargaTotalOP") as "totalInvoice" from "subTransaksiOP" sto2 where sto2."deletedAt" isnull and sto2 ."transaksiOPId" = to2.id group by sto2."transaksiOPId")
    // from "transaksiOP" to2 
    // join "subTransaksiOP" sto on sto."transaksiOPId" = to2.id
    // join stock s on sto."stockId" = s.id 
    // where to2."deletedAt" isnull and sto."deletedAt" isnull and to2."statusTransaksiOP" = 1
    // order by to2."createdAt" `);
    let hasil = [];

    for (let i = 0; i < transOP[0].length; i++) {
      for (let j = 0; j < op[0].length; j++) {
        let x = {};
        if (transOP[0][i].OPId == op[0][j].opId) {
          if (transOP[0][i].masterBarangId == op[0][j].masterBarangId) {
            if (transOP[0][i].isBonus) {
              transOP[0][i].isBonus = "Bonus";
            } else {
              transOP[0][i].isBonus = "Tidak Bonus";
            }
            x["noDO"] = transOP[0][i].nomorDO;
            x["tanggalPenjualan"] = moment(op[0][j].tanggalOrderOP).format(
              "YYYY/MM/DD"
            );
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
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Serova");

    let c = [
      { header: "Nomor DO", key: "noDO", width: 10 },
      { header: "Tanggal Penjualan", key: "tanggalPenjualan", width: 10 },
      { header: "Nomor OP", key: "noOP", width: 10 },
      { header: "Customer", key: "namaCustomer", width: 10 },
      { header: "Pembayaran", key: "pembayaran", width: 10 },
      { header: "Sales", key: "sales", width: 10 },
      { header: "Barang", key: "namaBarang", width: 10 },
      { header: "Status Barang", key: "statusBarang", width: 10 },
      { header: "Quantity", key: "qty", width: 10 },
      { header: "Harga Jual", key: "hargaJual", width: 10 },
      { header: "Total Jual", key: "totalJual", width: 10 },
      { header: "Total Invoice", key: "totalInvoice", width: 10 },
    ];

    sheet.columns = c;

    for (let k = 0; k < hasil.length; k++) {
      if (k > 0 && hasil[k].noDO == hasil[k - 1].noDO) {
        hasil[k].totalInvoice = "";
      }
      sheet.addRow(hasil[k]);
    }

    let fileName = "ALL_penjualan.xlsx";
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    await workbook.xlsx.write(res);
    res.end();
  }

  static async reportSearchPenjualan(req, res) {
    // const{namaCustomer,tglAwal,tglAkhir}=req.params;
    let { idCustomer, tglAwal, tglAkhir } = req.query;
    // console.log(req.query);
    let isi = "";
    let ext;
    if (!idCustomer && !tglAwal && !tglAkhir) {
      ext = "";
    } else {
      if (!idCustomer && tglAwal && tglAkhir) {
        tglAwal = moment(tglAwal).subtract(1, "days").format("YYYY-MM-DD");
        tglAkhir = moment(tglAkhir).subtract(1, "days").format("YYYY-MM-DD");
        isi += `o."tanggalOrderOP" between '${tglAwal}' and '${tglAkhir}'`;
      } else if (idCustomer && !tglAwal && !tglAkhir) {
        isi += `mc.id = '${idCustomer}'`;
      } else {
        tglAwal = moment(tglAwal).subtract(1, "days").format("YYYY-MM-DD");
        tglAkhir = moment(tglAkhir).subtract(1, "days").format("YYYY-MM-DD");
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
        console.log(transOP[0][i].OPId)
        let x = {};
        if (op[0][j].opId == transOP[0][i].OPId) {
          if (op[0][j].masterBarangId == transOP[0][i].masterBarangId) {
            if (transOP[0][i].isBonus) {
              transOP[0][i].isBonus = "Bonus";
            } else {
              transOP[0][i].isBonus = "Tidak Bonus";
            }
            x["noDO"] = transOP[0][i].nomorDO;
            x["tanggalPenjualan"] = moment(op[0][j].tanggalOrderOP).format(
              "YYYY/MM/DD"
            );
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
    // console.log(hasil);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Serova");

    let c = [
      { header: "Nomor DO", key: "noDO", width: 10 },
      { header: "Tanggal Penjualan", key: "tanggalPenjualan", width: 10 },
      { header: "Nomor OP", key: "noOP", width: 10 },
      { header: "Customer", key: "namaCustomer", width: 10 },
      { header: "Pembayaran", key: "pembayaran", width: 10 },
      { header: "Sales", key: "sales", width: 10 },
      { header: "Barang", key: "namaBarang", width: 10 },
      { header: "Status Barang", key: "statusBarang", width: 10 },
      { header: "Quantity", key: "qty", width: 10 },
      { header: "Harga Jual", key: "hargaJual", width: 10 },
      { header: "Total Jual", key: "totalJual", width: 10 },
      { header: "Total Invoice", key: "totalInvoice", width: 10 },
    ];

    sheet.columns = c;

    for (let k = 0; k < hasil.length; k++) {
      if (k > 0 && hasil[k].noDO == hasil[k - 1].noDO) {
        hasil[k].totalInvoice = "";
      }
      sheet.addRow(hasil[k]);
    }

    let fileName = "penjualan.xlsx";
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    await workbook.xlsx.write(res);
    res.end();
  }

  static async reportPO(req, res) {
    let data = await sq.query(`
    select distinct p."nomorPO" ,p."tanggalPO" ,ms."namaSupplier" ,p.pembayaran ,p."metodePengiriman" ,p.keterangan ,p."rencanaTglKedatangan",sum(p."totalHarga" ) as "totalOrder",tp."nomorInvoice" , tp."tglKedatangan", g."namaGudang" ,mb."namaBarang" ,s."tanggalKadaluarsa" ,s."batchNumber" ,stp."jumlahBarangSubTransaksiPO" as "quantity", s."jumlahStock" as "totalBarang"
    from "PO" p 
    join "masterSupplier" ms on ms.id = p."masterSupplierId" 
    join "subPO" sp on sp."POId" = p.id 
    join "masterBarang" mb on mb.id = sp."masterBarangId" 
    join "transaksiPO" tp on tp."POId" = p.id 
    join "subTransaksiPO" stp on stp."transaksiPOId" = tp.id 
    join stock s on s."masterBarangId" = mb.id 
    join gudang g on g.id = s."gudangId" 
    where p."deletedAt" isnull 
    and ms."deletedAt" isnull 
    and mb."deletedAt" isnull 
    and tp."deletedAt" isnull 
    and stp."deletedAt" isnull 
    and s."deletedAt" isnull 
    and g."deletedAt" isnull 
    group by (p."nomorPO",p."tanggalPO",ms."namaSupplier",p.pembayaran,p."metodePengiriman" ,p.keterangan ,p."rencanaTglKedatangan" ,sp.jumlah ,tp."nomorInvoice" , tp."tglKedatangan", g."namaGudang" ,mb."namaBarang" ,s."tanggalKadaluarsa" ,s."batchNumber" ,stp."jumlahBarangSubTransaksiPO", s."jumlahStock")`);

    let hasil = [];
    for (let i = 0; i < data[0].length; i++) {
      hasil.push({
        nomorPO: data[0][i]["nomorPO"],
        tanggalPO: moment(data[0][i]["tanggalPO"]).format("YYYY/MM/DD"),
        namaSupplier: data[0][i]["namaSupplier"],
        pembayaran: data[0][i]["pembayaran"],
        metodePengiriman: data[0][i]["metodePengiriman"],
        keterangan: data[0][i]["keterangan"],
        rencanaTglKedatangan: data[0][i]["rencanaTglKedatangan"],
        totalOrder: data[0][i]["totalOrder"],
        nomorInvoice: data[0][i]["nomorInvoice"],
        tglKedatangan: data[0][i]["tglKedatangan"],
        namaGudang: data[0][i]["namaGudang"],
        namaBarang: data[0][i]["namaBarang"],
        tanggalKadaluarsa: data[0][i]["tanggalKadaluarsa"],
        batchNumber: data[0][i]["batchNumber"],
        quantity: data[0][i]["quantity"],
        totalBarang: data[0][i]["totalBarang"],
      });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Serova");

    let c = [
      { header: "NO.PO", key: "nomorPO", width: 10 },
      { header: "Tanggal PO", key: "tanggalPO", width: 10 },
      { header: "Supplier", key: "namaSupplier", width: 10 },
      { header: "Pembayaran", key: "pembayaran", width: 10 },
      { header: "Metode Pengiriman", key: "metodePengiriman", width: 10 },
      { header: "Keterangan", key: "keterangan", width: 10 },
      { header: "Rencana Kedatangan", key: "rencanaTglKedatangan", width: 10 },
      { header: "Jumlah Order", key: "totalOrder", width: 10 },
      { header: "No.Invoice", key: "nomorInvoice", width: 10 },
      { header: "Tanggal Kedatangan", key: "tglKedatangan", width: 10 },
      { header: "Gudang", key: "namaGudang", width: 10 },
      { header: "Nama Barang", key: "namaBarang", width: 10 },
      { header: "Tanggal Kadaluarsa", key: "tanggalKadaluarsa", width: 10 },
      { header: "Batch Number", key: "batchNumber", width: 10 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Total Barang", key: "totalBarang", width: 10 },
    ];
    // console.log(x);
    sheet.columns = c;
    let isi = hasil;

    for (let i = 0; i < isi.length; i++) {
      sheet.addRow(isi[i]);
    }

    let fileName = "reportPO.xlsx";
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    await workbook.xlsx.write(res);
    res.end();
  }

  static async reportSearchPO(req, res) {
    let { tglAwal, tglAkhir } = req.query;
    let isi = "";
    let ext;
    if (!tglAwal && !tglAkhir) {
      ext = "";
    } else {
      if (tglAwal && tglAkhir) {
        tglAwal = moment(tglAwal).subtract(1, "days").format("YYYY-MM-DD");
        tglAkhir = moment(tglAkhir).subtract(1, "days").format("YYYY-MM-DD");
        isi += ` p."tanggalPO" between '${tglAwal}' and '${tglAkhir}'`;
      }
      ext = ` and ${isi}`;
    }

    let data = await sq.query(`
    select distinct p."nomorPO" ,p."tanggalPO" ,ms."namaSupplier" ,p.pembayaran ,p."metodePengiriman" ,p.keterangan ,p."rencanaTglKedatangan",sum(p."totalHarga" ) as "totalOrder",tp."nomorInvoice" , tp."tglKedatangan", g."namaGudang" ,mb."namaBarang" ,s."tanggalKadaluarsa" ,s."batchNumber" ,stp."jumlahBarangSubTransaksiPO" as "quantity", s."jumlahStock" as "totalBarang"
    from "PO" p 
    join "masterSupplier" ms on ms.id = p."masterSupplierId" 
    join "subPO" sp on sp."POId" = p.id 
    join "masterBarang" mb on mb.id = sp."masterBarangId" 
    join "transaksiPO" tp on tp."POId" = p.id 
    join "subTransaksiPO" stp on stp."transaksiPOId" = tp.id 
    join stock s on s."masterBarangId" = mb.id 
    join gudang g on g.id = s."gudangId" 
    where p."deletedAt" isnull 
    and ms."deletedAt" isnull 
    and mb."deletedAt" isnull 
    and tp."deletedAt" isnull 
    and stp."deletedAt" isnull 
    and s."deletedAt" isnull 
    and g."deletedAt" isnull ${ext} 
    group by (p."nomorPO",p."tanggalPO",ms."namaSupplier",p.pembayaran,p."metodePengiriman" ,p.keterangan ,p."rencanaTglKedatangan" ,sp.jumlah ,tp."nomorInvoice" , tp."tglKedatangan", g."namaGudang" ,mb."namaBarang" ,s."tanggalKadaluarsa" ,s."batchNumber" ,stp."jumlahBarangSubTransaksiPO", s."jumlahStock")`);

    let hasil = [];
    for (let i = 0; i < data[0].length; i++) {
      hasil.push({
        nomorPO: data[0][i]["nomorPO"],
        tanggalPO: moment(data[0][i]["tanggalPO"]).format("YYYY/MM/DD"),
        namaSupplier: data[0][i]["namaSupplier"],
        pembayaran: data[0][i]["pembayaran"],
        metodePengiriman: data[0][i]["metodePengiriman"],
        keterangan: data[0][i]["keterangan"],
        rencanaTglKedatangan: data[0][i]["rencanaTglKedatangan"],
        totalOrder: data[0][i]["totalOrder"],
        nomorInvoice: data[0][i]["nomorInvoice"],
        tglKedatangan: data[0][i]["tglKedatangan"],
        namaGudang: data[0][i]["namaGudang"],
        namaBarang: data[0][i]["namaBarang"],
        tanggalKadaluarsa: data[0][i]["tanggalKadaluarsa"],
        batchNumber: data[0][i]["batchNumber"],
        quantity: data[0][i]["quantity"],
        totalBarang: data[0][i]["totalBarang"],
      });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Serova");

    let c = [
      { header: "NO.PO", key: "nomorPO", width: 10 },
      { header: "Tanggal PO", key: "tanggalPO", width: 10 },
      { header: "Supplier", key: "namaSupplier", width: 10 },
      { header: "Pembayaran", key: "pembayaran", width: 10 },
      { header: "Metode Pengiriman", key: "metodePengiriman", width: 10 },
      { header: "Keterangan", key: "keterangan", width: 10 },
      { header: "Rencana Kedatangan", key: "rencanaTglKedatangan", width: 10 },
      { header: "Jumlah Order", key: "totalOrder", width: 10 },
      { header: "No.Invoice", key: "nomorInvoice", width: 10 },
      { header: "Tanggal Kedatangan", key: "tglKedatangan", width: 10 },
      { header: "Gudang", key: "namaGudang", width: 10 },
      { header: "Nama Barang", key: "namaBarang", width: 10 },
      { header: "Tanggal Kadaluarsa", key: "tanggalKadaluarsa", width: 10 },
      { header: "Batch Number", key: "batchNumber", width: 10 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Total Barang", key: "totalBarang", width: 10 },
    ];
    // console.log(x);
    sheet.columns = c;
    let isi2 = hasil;

    for (let i = 0; i < isi2.length; i++) {
      sheet.addRow(isi2[i]);
    }

    let fileName = "reportSearchPO.xlsx";
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    await workbook.xlsx.write(res);
    res.end();
  }
}

module.exports = Controller;
