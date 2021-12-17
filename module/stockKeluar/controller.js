const stockKeluar = require("./model");
const stock = require("../stock/model");
const masterBarang = require("../masterBarang/model");
const sq = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");

class Controller {
  static async register(req, res) {
    const {
      tanggalKeluar,
      keteranganKeluar,
      jumlahBarangKeluar,
      masterBarangId,
      batchNumber,
    } = req.body;
    let data = await sq.query(
      `select *,(select mb."namaBarang" from "masterBarang" mb where mb.id = s."masterBarangId") from stock s where s."deletedAt" isnull and s."masterBarangId" = '${masterBarangId}' and s."batchNumber" ='${batchNumber}'`
    );
    let barang = await sq.query(
      `select * from "masterBarang" mb where mb."deletedAt" isnull and mb.id='${masterBarangId}'`
    );
    if (data[0].length) {
      if (data[0][0].jumlahStock > jumlahBarangKeluar) {
        stockKeluar
          .create({
            id: uuid_v4(),
            tanggalKeluar,
            keteranganKeluar,
            jumlahBarangKeluar,
            stockId: data[0][0].id,
          })
          .then((data2) => {
            let hasil = data[0][0].jumlahStock - jumlahBarangKeluar;
            stock
              .update(
                { jumlahStock: hasil },
                { where: { masterBarangId, batchNumber } }
              )
              .then((data3) => {
                let hasilBarang =
                  barang[0][0].jumlahTotalBarang - jumlahBarangKeluar;
                masterBarang
                  .update(
                    { jumlahTotalBarang: hasilBarang },
                    { where: { id: masterBarangId } }
                  )
                  .then((data4) => {
                    res.status(200).json({ status: 200, message: "sukses" });
                  })
                  .catch((err) => {
                    res
                      .status(500)
                      .json({ status: 200, message: "gagal", data: err });
                  });
              });
          });
      } else {
        let totBarang = [
          {
            namaBarang: data[0][0].namaBarang,
            stock: data[0][0].jumlahStock,
            jumlahBarangKeluar,
          },
        ];
        res
          .status(200)
          .json({ status: 200, message: "Stock tidak cukup", data: totBarang });
      }
    } else {
      res.status(200).json({ status: 200, message: "Barang tidak ada" });
    }
  }

  static async update(req, res) {
    const {
      idStockKeluar,
      tanggalKeluar,
      keteranganKeluar,
      jumlahBarangKeluar,
      masterBarangId,
      batchNumber,
    } = req.body;
    let data = await sq.query(
      `select *,(select mb."namaBarang" from "masterBarang" mb where mb.id = s."masterBarangId") from stock s where s."deletedAt" isnull and s."masterBarangId" = '${masterBarangId}' and s."batchNumber" ='${batchNumber}'`
    );
    let barang = await sq.query(
      `select * from "masterBarang" mb where mb."deletedAt" isnull and mb.id='${masterBarangId}'`
    );
    stockKeluar.findAll({ where: { id: idStockKeluar } }).then((data2) => {
      let totalStock = data2[0].jumlahBarangKeluar + data[0][0].jumlahStock;
      if (totalStock < jumlahBarangKeluar) {
        let barang = {
          namaBarang: data[0][0].namaBarang,
          jumlahStock: totalStock,
          jumlahBarangKeluar,
        };
        res
          .status(200)
          .json({ status: 200, message: "Stock tidak cukup", data: barang });
      } else {
        stockKeluar
          .update(
            { jumlahBarangKeluar, tanggalKeluar, keteranganKeluar },
            { where: { id: idStockKeluar } }
          )
          .then((data3) => {
            let hasil = data2[0].jumlahBarangKeluar - jumlahBarangKeluar;
            stock
              .update(
                { jumlahStock: data[0][0].jumlahStock + hasil },
                { where: { id: data2[0].stockId } }
              )
              .then((data4) => {
                masterBarang
                  .update(
                    {
                      jumlahTotalBarang: barang[0][0].jumlahTotalBarang + hasil,
                    },
                    { where: { id: masterBarangId } }
                  )
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
      }
    });
  }

  static async list(req, res) {
    let data =
      await sq.query(`select sk.id as "skId",sk."tanggalKeluar",sk."keteranganKeluar",sk."jumlahBarangKeluar",sk."stockId",mb."namaBarang",s."batchNumber",s."tanggalKadaluarsa",sk."createdAt",sk."deletedAt"
        from "stockKeluar" sk 
        join stock s on sk."stockId" = s.id
        join "masterBarang" mb on mb.id = s."masterBarangId" 
        join gudang g on g.id = s."gudangId" 
        where sk."deletedAt" isnull and s."deletedAt" isnull and mb."deletedAt" isnull and g."deletedAt" isnull
        order by sk."createdAt" `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listBarangKeluarByBatchNumber(req, res) {
    const { batch } = req.params;
    let data =
      await sq.query(`select sk.id as "skId",sk."tanggalKeluar",sk."keteranganKeluar",sk."jumlahBarangKeluar",sk."stockId",mb."namaBarang",s."batchNumber",s."tanggalKadaluarsa",sk."createdAt",sk."deletedAt"
        from "stockKeluar" sk 
        join stock s on sk."stockId" = s.id
        join "masterBarang" mb on mb.id = s."masterBarangId" 
        join gudang g on g.id = s."gudangId" 
        where sk."deletedAt" isnull and s."deletedAt" isnull and mb."deletedAt" isnull and g."deletedAt" isnull and s."batchNumber" ='${batch}'
        order by sk."createdAt" `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async detailsById(req, res) {
    const { skId } = req.params;
    let data =
      await sq.query(`select sk.id as "skId",sk."tanggalKeluar",sk."keteranganKeluar",sk."jumlahBarangKeluar",sk."stockId",s."jumlahStock" ,s."tanggalKadaluarsa",s."hargaBeliSatuanStock",s."batchNumber",mb."namaBarang",g."kodeGudang" ,g."namaGudang",sk."createdAt",sk."deletedAt"
        from "stockKeluar" sk 
        join stock s on sk."stockId" = s.id
        join "masterBarang" mb on mb.id = s."masterBarangId" 
        join gudang g on g.id = s."gudangId" 
        where sk."deletedAt" isnull and s."deletedAt" isnull and mb."deletedAt" isnull and g."deletedAt" isnull and sk.id = '${skId}'
        order by sk."createdAt" `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async delete(req, res) {
    const { skId } = req.body;
    stockKeluar
      .destroy({ where: { id: skId } })
      .then(async (data2) => {
        let data = await sq.query(
          `select * from "stockKeluar" sk join stock s on s.id = sk."stockId" join "masterBarang" mb on s."masterBarangId" = mb.id where s."deletedAt" isnull and sk."deletedAt" isnull  and mb."deletedAt" isnull and sk.id = '${skId}'`
        );
        let hasil = data[0][0].jumlahStock + data[0][0].jumlahBarangKeluar;
        stock
          .update({ jumlahStock: hasil }, { where: { id: data[0][0].stockId } })
          .then((data3) => {
            let totalB =
              data[0][0].jumlahTotalBarang + data[0][0].jumlahBarangKeluar;
            masterBarang
              .update(
                { jumlahTotalBarang: totalB },
                { where: { id: data[0][0].masterBarangId } }
              )
              .then((data4) => {
                res.status(200).json({ status: 200, message: "sukses" });
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ status: 500, message: "gagal", data: err });
              });
          });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "stock sudah terhapus" });
      });
  }
}

module.exports = Controller;
