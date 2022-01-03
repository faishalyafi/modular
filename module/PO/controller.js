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
    const { nomorPO, tanggalPO, rencanaTglKedatangan, masterSupplierId, pembayaran, TOP, metodePengiriman, totalHarga, keterangan, PPN, bulkCC, promo, rev, bulkBarang, PRId } = req.body;
    const idPO = uuid_v4();
    PO.findAll({ where: { nomorPO } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "nomorPO sudah ada" });
      } else {
        PO.create({ id: idPO, nomorPO, tanggalPO, rencanaTglKedatangan, masterSupplierId, pembayaran, TOP, metodePengiriman, totalHarga, keterangan, PPN, promo, rev, PRId }).then((data1) => {
          for (let i = 0; i < bulkCC.length; i++) {
            const idCC = uuid_v4();
            bulkCC[i].POId = idPO;
            bulkCC[i].id = idCC;
          }
          CC.bulkCreate(bulkCC).then((data2) => {
            for (let i = 0; i < bulkBarang.length; i++) {
              const idSub = uuid_v4();
              bulkBarang[i].POId = idPO;
              bulkBarang[i].id = idSub;
            }
            subPO.bulkCreate(bulkBarang).then((data3) => {
              for (let i = 0; i < bulkBarang.length; i++) {
                bulkBarang[i].id =
                  bulkBarang[i].masterBarangId + "-" + masterSupplierId;
                bulkBarang[i].masterSupplierId = masterSupplierId;
              }
              poolHargaSupplier.bulkCreate(bulkBarang, { updateOnDuplicate: ["hargaBeli"] }).then((data4) => {
                if (PRId) {
                  PR.update({ statusPR: 1 }, { where: { id: PRId } }).then((data5) => {
                    res.status(200).json({ status: 200, message: "sukses" });
                  }).catch((err) => {
                    console.log("PR", err);
                    res.status(500).json({ status: 500, message: "gagal", data: err });
                  })
                } else {
                  res.status(200).json({ status: 200, message: "sukses" });
                }
              }).catch((err) => {
                res.status(500).json({ status: 500, message: "gagal", data: err });
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
    const { POId, tanggalPO, rencanaTglKedatangan, masterSupplierId, pembayaran, TOP, metodePengiriman, totalHarga, keterangan, PPN, promo, rev, statusPO, bulkCC, bulkBarang, PRId } = req.body;
    PO.update({ tanggalPO, rencanaTglKedatangan, masterSupplierId, pembayaran, TOP, metodePengiriman, totalHarga, keterangan, PPN, promo, rev, statusPO, PRId }, { where: { id: POId } }).then((data) => {
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
    // let data = await sq.query(`select distinct p.id as "idPO", p."nomorPO",p."tanggalPO" ,p.pembayaran ,p."TOP",p."metodePengiriman" ,p.keterangan ,p."PPN", p.promo, p."createdAt",p."updatedAt",p."deletedAt" ,p."masterSupplierId",p."PRId",p."totalHarga" ,p."rencanaTglKedatangan" ,ms.id,ms."namaSupplier" ,ms."deletedAt" ,sp."POId" ,sum(sp.jumlah) as "totalBarangPO", sp."deletedAt",p2."nomorPR" from "subPO" sp join "PO" p on sp."POId" = p.id left join "PR" p2 on p2.id = p."PRId" join "masterSupplier" ms on p."masterSupplierId" = ms.id where sp."deletedAt" isnull and ms."deletedAt" isnull and p."deletedAt" isnull group  by(ms.id,p.id, sp."POId",sp."deletedAt",p2."nomorPR")`);
    // let data = await sq.query(`select distinct p.id as "idPO", p."nomorPO",p."tanggalPO" ,p.pembayaran ,p."TOP",p."metodePengiriman" ,p.keterangan ,p."PPN", p.promo, p."createdAt",p."updatedAt",p."deletedAt" ,p."masterSupplierId",p."PRId",p2."nomorPR",p."totalHarga" ,p."rencanaTglKedatangan" ,ms.id,ms."namaSupplier" ,ms."deletedAt" ,sp."POId" ,sum(sp.jumlah) as "totalBarangPO", sp."deletedAt" from "subPO" sp join "PO" p on sp."POId" = p.id join "masterSupplier" ms on p."masterSupplierId" = ms.id left join "PR" p2 on p2.id = p."PRId" where sp."deletedAt" isnull and ms."deletedAt" isnull and p."deletedAt" isnull and p2."deletedAt" isnull group  by ms.id,p.id, sp."POId",sp."deletedAt",p2."nomorPR"`);
    let data = await sq.query(`select p.id as "idPO", p."nomorPO",p."tanggalPO",p."rencanaTglKedatangan",p.pembayaran,p."TOP",p."metodePengiriman",p."totalHarga",p.keterangan,p."PPN",p.promo,p.rev,p."masterSupplierId",ms."namaSupplier",p."PRId",p2."nomorPR",sum(sp.jumlah) as "totalBarangPO" from "subPO" sp join "PO" p on p.id = sp."POId" join "masterSupplier" ms on ms.id = p."masterSupplierId" left join "PR" p2 on p2.id = p."PRId" where sp."deletedAt" isnull and p."deletedAt" isnull and ms."deletedAt" isnull and p2."deletedAt" isnull group by p.id,sp."POId",ms."namaSupplier",p2."nomorPR" order by p."createdAt"`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listByStatus(req, res) {
    const { statusPO } = req.params;
    let data = await sq.query(`
    select p.id as "idPO", p."nomorPO",p."tanggalPO",p."rencanaTglKedatangan",p.pembayaran,p."TOP",p."metodePengiriman",p."totalHarga",p.keterangan,p."PPN",p.promo,p.rev,p."masterSupplierId",ms."namaSupplier",p."PRId",p2."nomorPR",sum(sp.jumlah) as "totalBarangPO",p."statusPO",p."createdAt" 
    from "subPO" sp join "PO" p on p.id = sp."POId" 
      join "masterSupplier" ms on ms.id = p."masterSupplierId" 
      left join "PR" p2 on p2.id = p."PRId" 
    where p."statusPO" = ${statusPO}
      and sp."deletedAt" isnull 
      and p."deletedAt" isnull 
      and ms."deletedAt" isnull 
      and p2."deletedAt" isnull 
    group by p.id,sp."POId",ms."namaSupplier",p2."nomorPR" 
    order by p."createdAt" desc`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listKedatanganPO(req, res) {
    let data = await sq.query(`
    select p.id as "POId", p."nomorPO" ,p2."nomorPR" ,p."tanggalPO" ,p."rencanaTglKedatangan" ,p.pembayaran ,p."TOP" ,p."metodePengiriman" ,p."totalHarga" ,p.keterangan ,p."PPN" ,p.promo ,p.rev ,p."masterSupplierId",ms."namaSupplier" ,p."statusPO" 
    from "PO" p 
    left join "transaksiPO" tp on tp."POId" = p.id 
    left join "PR" p2 on p2.id = p."PRId" 
    join "masterSupplier" ms on ms.id = p."masterSupplierId" 
    where p."deletedAt" isnull 
    and tp."deletedAt" isnull 
    and ms."deletedAt" isnull  `);
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

  static async detailsBarangPOByNoPO(req,res){
    const {nomorPO} = req.params

    PO.findAll({where:{nomorPO},raw:true}).then(async(data)=>{
      if(data.length==0){
        res.status(200).json({status:200,message:"data tidak ada"});
      }else{
        let order = await sq.query(`select sp.id as "subPOId", sp.jumlah as "jumlahOrder",sp."hargaBeli",sp."totalHargaPerBarang",sp."POId",sp."masterBarangId" ,mb."namaBarang",p2."nomorPR",mb."masterKategoriBarangId",mkb."namaKategori" from "subPO" sp join "PO" p on p.id = sp."POId" left join "PR" p2 on p2.id = p."PRId" join "masterBarang" mb on mb.id = sp."masterBarangId" join "masterKategoriBarang" mkb on mkb.id = mb."masterKategoriBarangId" where sp."deletedAt" isnull and p."deletedAt" isnull and p2."deletedAt" isnull and mkb."deletedAt" isnull and p."nomorPO" = '${nomorPO}'`);
        let TPO = await sq.query(`select stp."masterBarangId",stp."hargaTransaksi", mb."namaBarang", sum(stp."jumlahBarangSubTransaksiPO") as "terkirim" from "subTransaksiPO" stp join "transaksiPO" tp on tp.id = stp."transaksiPOId" join "PO" p on p.id = tp."POId" join "masterBarang" mb on mb.id = stp."masterBarangId" where stp."deletedAt" isnull and tp."deletedAt" isnull and p."deletedAt" isnull and p."nomorPO" = '${nomorPO}' group by stp."masterBarangId", mb."namaBarang", stp."hargaTransaksi" `);
        // let TPO = await sq.query(`select stp.id as "subTransaksiPOId",stp.*,mb."namaBarang" from "subTransaksiPO" stp join "transaksiPO" tp on tp.id = stp."transaksiPOId" join "PO" p on p.id = tp."POId" join "masterBarang" mb on mb.id = stp."masterBarangId" where stp."deletedAt" isnull and tp."deletedAt" isnull and p."deletedAt" isnull and p."nomorPO" = '${nomorPO}'`);
        // console.log(order[0]);
        // console.log("========================");
        // console.log(TPO[0]);

        for (let i = 0; i < order[0].length; i++) {
            order[0][i].jmlTerkirim = 0;
            order[0][i].jmlBelumDikirim = 0;
            if(TPO[0].length){
              for (let j = 0; j < TPO[0].length; j++) {
                if(order[0][i].masterBarangId == TPO[0][j].masterBarangId && order[0][i].hargaBeli == TPO[0][j].hargaTransaksi){
                  order[0][i].jmlTerkirim = TPO[0][j].terkirim;
                  order[0][i].jmlBelumDikirim = order[0][i].jumlahOrder - TPO[0][j].terkirim;
                }
              }
            }
        }
        data[0].nomorPR = order[0][0].nomorPR;
        data[0].barang = order[0];
        res.status(200).json({ status: 200, message: "sukses",data});

      }
    }).catch((err)=>{
      console.log("err",err);
      res.status(500).json({ status: 500, message: "gagal",data:err });
    })
  }

}

module.exports = Controller;
