const PO = require("./model");
const CC = require("../poCC/model");
const subPO = require("../subPO/model");
const poolHargaSupplier = require("../poolHargaSupplier/model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");
const moment = require("moment");

class Controller {
  static async generateNoPO(req, res) {
    let db = await PO.findAll();
    let acak = moment().format(`ddYYMMDhhmmssms`);
    let nomorPO = `PO${acak}${db.length}`;
    res.status(200).json({ status: 200, message: "sukses", nomorPO: nomorPO });
  }

  static register(req, res) {
    const {
      nomorPO,
      tanggalPO,
      rencanaTglKedatangan,
      masterSupplierId,
      pembayaran,
      TOP,
      metodePengiriman,
      totalHarga,
      keterangan,
      PPN,
      bulkCC,
      promo,
      rev,
      bulkBarang,
    } = req.body;
    const idPO = uuid_v4();
    PO.findAll({ where: { nomorPO } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "nomorPO sudah ada" });
      } else {
        PO.create({
          id: idPO,
          nomorPO,
          tanggalPO,
          rencanaTglKedatangan,
          masterSupplierId,
          pembayaran,
          TOP,
          metodePengiriman,
          totalHarga,
          keterangan,
          PPN,
          promo,
          rev,
        }).then((data) => {
          for (let i = 0; i < bulkCC.length; i++) {
            const idCC = uuid_v4();
            bulkCC[i].POId = idPO;
            bulkCC[i].id = idCC;
          }
          CC.bulkCreate(bulkCC).then((data) => {
            for (let i = 0; i < bulkBarang.length; i++) {
              const idSub = uuid_v4();
              bulkBarang[i].POId = idPO;
              bulkBarang[i].id = idSub;
            }
            subPO.bulkCreate(bulkBarang).then((data) => {
              for (let i = 0; i < bulkBarang.length; i++) {
                bulkBarang[i].id =
                  bulkBarang[i].masterBarangId + "-" + masterSupplierId;
                bulkBarang[i].masterSupplierId = masterSupplierId;
              }
              poolHargaSupplier
                .bulkCreate(bulkBarang, { updateOnDuplicate: ["hargaBeli"] })
                .then((data) => {
                  res.status(200).json({ status: 200, message: "sukses" });
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ status: 500, message: "gagal", data: err });
                });
            });
          });
        });
      }
    });
  }

  static delete(req, res) {
    const { id } = req.body;
    PO.destroy({ where: { id } }).then((data) => {
      CC.destroy({ where: { POId: id } }).then((data) => {
        subPO
          .destroy({ where: { POId: id } })
          .then((data) => {
            res.status(200).json({ staus: 200, message: "sukses" });
          })
          .catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
          });
      });
    });
  }

  // static update(req, res) {
  //   const {
  //     id,
  //     tanggalPO,
  //     rencanaTglKedatangan,
  //     masterSupplierId,
  //     pembayaran,
  //     TOP,
  //     metodePengiriman,
  //     totalHarga,
  //     keterangan,
  //     PPN,
  //     promo,
  //     rev,
  //   } = req.body;
  //   PO.update(
  //     {
  //       tanggalPO,
  //       rencanaTglKedatangan,
  //       masterSupplierId,
  //       pembayaran,
  //       TOP,
  //       metodePengiriman,
  //       totalHarga,
  //       keterangan,
  //       PPN,
  //       promo,
  //       rev,
  //     },
  //     { where: { id } }
  //   )
  //     .then((data) => {
  //       res.status(200).json({ status: 200, message: "sukses" });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ status: 500, message: "gagal", data: err });
  //     });
  // }

  static async listBarangByNoPO(req, res) {
    const { nomorPO } = req.params;
    // let data = await sq.query(
    //   `select sp.id as "subPOId",p."createdAt" as "tglPembuatanPO",* from "subPO" sp join "PO" p on p.id = sp."POId" join "masterBarang" mb ON mb.id =sp."masterBarangId" where sp."deletedAt" isnull and p."deletedAt" isnull and mb."deletedAt" isnull and p."nomorPO" ='${nomorPO}' `
    // );
    let data = await sq.query(`select sp.id as "subPOId",p."createdAt" as "tglPembuatanPO",* from "subPO" sp join "PO" p on p.id = sp."POId" join "masterBarang" mb ON mb.id =sp."masterBarangId" join "masterKategoriBarang" mkb on mb."masterKategoriBarangId" = mkb .id where sp."deletedAt" isnull and p."deletedAt" isnull and mb ."deletedAt" isnull and mkb."deletedAt" isnull and p."nomorPO" = '${nomorPO}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  // static updateSubPO(req, res) {
  //   const { masterSupplierId,POId, bulkBarang,hargaTotal } = req.body;
  //   subPO.destroy({ where: { POId } }).then((data) => {
  //     for (let i = 0; i < bulkBarang.length; i++) {
  //       const idSub = uuid_v4();
  //       bulkBarang[i].POId = POId;
  //       bulkBarang[i].id = idSub;
  //     }
  //     subPO.bulkCreate(bulkBarang).then((data2)=>{
  //       for (let i = 0; i < bulkBarang.length; i++) {
  //         bulkBarang[i].id =
  //           bulkBarang[i].masterBarangId + "-" + masterSupplierId;
  //         bulkBarang[i].masterSupplierId = masterSupplierId;
  //       }
  //       poolHargaSupplier.bulkCreate(bulkBarang,{updateOnDuplicate:["hargaBeli"]}).then((data3) => {
  //         PO.update({hargaTotal},{where:{id:POId}}).then((data4)=>{
  //           res.status(200).json({status:200,message:"sukses"});
  //         }).catch((err)=>{
  //           res.status(500).json({ status: 500, message: "gagal", data: err });
  //         })
  //       });
  //     });
  //   });
  // }

  static update(req, res) {
    const {
      POId,
      tanggalPO,
      rencanaTglKedatangan,
      masterSupplierId,
      pembayaran,
      TOP,
      metodePengiriman,
      totalHarga,
      keterangan,
      PPN,
      promo,
      rev,
      bulkCC,
      bulkBarang,
    } = req.body;
    PO.update(
      {
        tanggalPO,
        rencanaTglKedatangan,
        masterSupplierId,
        pembayaran,
        TOP,
        metodePengiriman,
        totalHarga,
        keterangan,
        PPN,
        promo,
        rev,
      },
      { where: { id: POId } }
    ).then((data) => {
      subPO.destroy({ where: { POId: POId } }).then((data) => {
        for (let i = 0; i < bulkBarang.length; i++) {
          const idSub = uuid_v4();
          bulkBarang[i].POId = POId;
          bulkBarang[i].id = idSub;
        }
        subPO.bulkCreate(bulkBarang).then((data2) => {
          for (let i = 0; i < bulkBarang.length; i++) {
            bulkBarang[i].id =
              bulkBarang[i].masterBarangId + "-" + masterSupplierId;
            bulkBarang[i].masterSupplierId = masterSupplierId;
          }
          poolHargaSupplier
            .bulkCreate(bulkBarang, { updateOnDuplicate: ["hargaBeli"] })
            .then((data3) => {
              CC.destroy({
                where: {
                  POId: POId,
                },
              }).then((data4) => {
                for (let i = 0; i < bulkCC.length; i++) {
                  const idCC = uuid_v4();
                  bulkCC[i].POId = POId;
                  bulkCC[i].id = idCC;
                }
                CC.bulkCreate(bulkCC)
                  .then((data5) => {
                    res.status(200).json({ status: 200, message: "sukses" });
                  })
                  .catch((err) => {
                    res
                      .status(500)
                      .json({ status: 500, message: "gagal", data: err });
                  });
              });
            });
        });
      });
    });
  }

  static async listCCByNoPO(req, res) {
    const { nomorPO } = req.params;
    let data = await sq.query(`select pc.id as "poCCId",* from "poCC" pc join "PO" p ON p.id = pc."POId" where p."deletedAt" isnull and pc."deletedAt" isnull and p."nomorPO" ='${nomorPO}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  // static updateCC(req, res) {
  //   const { POId, bulkCC } = req.body;
  //   CC.destroy({ where: { POId: POId } }).then((data) => {
  //     for (let i = 0; i < bulkCC.length; i++) {
  //       const idCC = uuid_v4();
  //       bulkCC[i].POId = POId;
  //       bulkCC[i].id = idCC;
  //     }
  //     CC.bulkCreate(bulkCC)
  //       .then((data) => {
  //         res.status(200).json({ status: 200, message: "sukses" });
  //       })
  //       .catch((err) => {
  //         res.status(500).json({ status: 500, message: "gagal", data: err });
  //       });
  //   });
  // }

  static async list(req, res) {
    // let data =
    //   await sq.query(`select p.id as "idPO" ,p."nomorPO" ,p."tanggalPO" ,p.pembayaran ,p."TOP" ,p."metodePengiriman" ,p.keterangan ,p."PPN" ,p.promo ,p.rev , p."createdAt", p."updatedAt", p."deletedAt" ,p."masterSupplierId" ,p."totalHarga" ,p."rencanaTglKedatangan" ,ms.id, ms."namaSupplier", ms."deletedAt"
    //   from "PO" p join "masterSupplier" ms on p."masterSupplierId" = ms .id where p."deletedAt" isnull and ms."deletedAt" isnull `);
    let data = await sq.query(`select distinct p.id as "idPO", p."nomorPO",p."tanggalPO" ,p.pembayaran ,p."TOP",p."metodePengiriman" ,p.keterangan ,p."PPN", p.promo, p."createdAt",p."updatedAt",p."deletedAt" ,p."masterSupplierId",p."PRId",p."totalHarga" ,p."rencanaTglKedatangan" ,ms.id,ms."namaSupplier" ,ms."deletedAt" ,sp."POId" ,sum(sp.jumlah) as "totalBarangPO", sp."deletedAt" from "subPO" sp join "PO" p on sp."POId" = p.id join "masterSupplier" ms on p."masterSupplierId" = ms.id where sp."deletedAt" isnull and ms."deletedAt" isnull and p."deletedAt" isnull group  by(ms.id,p.id, sp."POId",sp."deletedAt")`);
    // let data = await sq.query(`select distinct p.id as "idPO", p."nomorPO",p."tanggalPO" ,p.pembayaran ,p."TOP",p."metodePengiriman" ,p.keterangan ,p."PPN", p.promo, p."createdAt",p."updatedAt",p."deletedAt" ,p."masterSupplierId",p."PRId",p2."nomorPR",p."totalHarga" ,p."rencanaTglKedatangan" ,ms.id,ms."namaSupplier" ,ms."deletedAt" ,sp."POId" ,sum(sp.jumlah) as "totalBarangPO", sp."deletedAt" from "subPO" sp join "PO" p on sp."POId" = p.id join "masterSupplier" ms on p."masterSupplierId" = ms.id left join "PR" p2 on p2.id = p."PRId" where sp."deletedAt" isnull and ms."deletedAt" isnull and p."deletedAt" isnull and p2."deletedAt" isnull group  by ms.id,p.id, sp."POId",sp."deletedAt",p2."nomorPR"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async hargaPOTerahir(req, res) {
    const { masterSupplierId, masterBarangId } = req.body;
    const id = masterBarangId + "-" + masterSupplierId;
    let data = await sq.query(`select phs.id as "poolHSid", phs."masterSupplierId", ms."namaSupplier" ,phs."masterBarangId", mb."namaBarang" ,phs."hargaBeli" from "poolHargaSupplier" phs  join "masterBarang" mb on phs."masterBarangId" = mb.id  join "masterSupplier" ms on phs."masterSupplierId" = ms.id where phs."deletedAt" isnull and mb."deletedAt" isnull and ms."deletedAt" isnull and phs.id = '${id}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listAllLaporanPO(req, res) {
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

    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async searchLaporanPO(req, res) {
    const { tglAwal, tglAkhir } = req.body;
    let isi = "";
    let ext;
    if (!tglAwal && !tglAkhir) {
      ext = "";
    } else {
      if (tglAwal && tglAkhir) {
        isi += `p."tanggalPO" between '${tglAwal}' and '${tglAkhir}' `;
      }
      ext = ` and ${isi}`;
    }
    // console.log(isi)
    // console.log(ext);
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

    // console.log(data[0].length)
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
}

module.exports = Controller;
