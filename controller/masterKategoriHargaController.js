const masterKategoriHarga = require("../model/masterKategoriHargaModel");
const poolHargaJual = require("../module/poolHargaJual/model");

const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
    static register( req, res ) {
		const {kategoriToko} = req.body;
		  masterKategoriHarga
			.findAll({ where: { kategoriToko: kategoriToko } })
			.then((data) => {
			  if (data.length) {
				res.status(200).json({ status: 200, message: "data sudah ada" });
			  } else {
				masterKategoriHarga
				  .create({
					  id:uuid_v4(),
					kategoriToko,
				  })
				  .then((data) => {
					res.status(200).json({ status: 200, message: "sukses" });
				  });
			  }
			})
			.catch((err) => {
			  res.status(500).json({ status: 500, message: "gagal", data: err });
			});
}
static list(req, res) {
    masterKategoriHarga
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
    masterKategoriHarga
      .findAll({ where: { id: id } })
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
  static detailsByToko(req, res) {
    const { kategoriToko } = req.params;
    // console.log(req.params);
    masterKategoriHarga
      .findAll({ where: { kategoriToko: kategoriToko } })
      .then((data) => {
        console.log(data);
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
  static update(req, res) {
    const { id, kategoriToko } = req.body;
    masterKategoriHarga
      .update(
        {
          kategoriToko,
        },
        { where: { id }, returning: true }
      )
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete(req, res) {
    const { id } = req.body;
    masterKategoriHarga
      .destroy({
        where: {
          id: id,
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
  static async listBarangByMasterKategoriHargaId(req, res) {
		let { masterKategoriHargaId } = req.params;
		let data = await sq.query(`
		select mb.id as "masterBarangId" , mb."namaBarang" ,mb.barcode ,mb.foto ,mb."masterKategoriBarangId" ,mb."masterUnitId" ,mb."kodeBarang" ,phj."hargaJual" ,mb."jumlahTotalBarang", mb."createdAt" ,mb."updatedAt" ,mb."deletedAt" 
		from "masterBarang" mb 
		join "poolHargaJual" phj on phj."masterBarangId" = mb.id 
		join "masterKategoriHarga" mkh on mkh.id = phj."masterKategoriHargaId" 
		where mkh.id = '${masterKategoriHargaId}' 
		and mb."deletedAt" isnull 
		and phj."deletedAt" isnull 
		and mkh."deletedAt" isnull `);

		res.status(200).json({ status: 200, message: "sukses", data:data[0] });
	}
  static bulkHargaJual(req, res) {
    const { kategoriToko,bulkHargaJual } = req.body;
    masterKategoriHarga.findAll({
      where: { kategoriToko }
    })
    .then((data) => {
      if (data.length == 0) {
        masterKategoriHarga.create({
          id: uuid_v4(),
          kategoriToko
        })
        .then((data2) => {
          for (let i = 0; i < bulkHargaJual.length; i++) {
            bulkHargaJual[i].id = bulkHargaJual[i].masterBarangId + "-" + data2.id;
            bulkHargaJual[i].masterKategoriHargaId = data2.id; 
          }
          poolHargaJual.bulkCreate(bulkHargaJual, { updateOnDuplicate: ["hargaJual"] })
          .then((data3) => {
            res.status( 200 ).json({status: 200,message: "sukses"})
          })
          .catch((err) => {
            res.status(500).json({ status: 500, message: "gagal", data: err });
          })
        })
      } else {
        for (let i = 0; i < bulkHargaJual.length; i++) {
          bulkHargaJual[i].id = bulkHargaJual[i].masterBarangId + "-" + data[0].id;
          bulkHargaJual[i].masterKategoriHargaId = data[0].id; 
        }
        poolHargaJual.bulkCreate(bulkHargaJual, { updateOnDuplicate: ["hargaJual"] })
        .then((data4) => {
          res.status( 200 ).json({status: 200,message: "sukses"})
        })
        .catch((err) => {
          res.status(500).json({ status: 500, message: "gagal", data: err });
        })
      }
    })
  }
}

module.exports = Controller;
