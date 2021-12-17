const riwayatPendidikan = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
    static register( req, res ) {
		const {tingkatPendidikan,tahunLulus,namaSekolah,jurusan,kelengkapanLamaranId} = req.body;
		  riwayatPendidikan.findAll({ where: { kelengkapanLamaranId: kelengkapanLamaranId } }).then((data) => {
			  if (data.length) {
				res.status(200).json({ status: 200, message: "data sudah ada" });
			  } else {
				riwayatPendidikan.create({id:uuid_v4(),tingkatPendidikan,tahunLulus,namaSekolah,jurusan,kelengkapanLamaranId}).then((data) => {
					res.status(200).json({ status: 200, message: "sukses" });
				  });
			  }
			}).catch((err) => {
			  res.status(500).json({ status: 500, message: "gagal", data: err });
			});
}
static list(req, res) {
    riwayatPendidikan.findAll().then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500, message: "gagal",data: err});
      });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    riwayatPendidikan.findAll({ where: { id: id } }).then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500, message: "gagal",data: err});
      });
  }

  static update(req, res) {
    const {kelengkapanLamaranId,bulkRiwayatPendidikan } = req.body;
    riwayatPendidikan.destroy({ where: { kelengkapanLamaranId: kelengkapanLamaranId } }).then((data) => {
      for (let i = 0; i < bulkRiwayatPendidikan.length; i++) {
        const idRiwayatPendidikan = uuid_v4();
        bulkRiwayatPendidikan[i].kelengkapanLamaranId = kelengkapanLamaranId;
        bulkRiwayatPendidikan[i].id = idRiwayatPendidikan;
      }
      riwayatPendidikan.bulkCreate(bulkRiwayatPendidikan).then((data2) => {
        res.status(200).json({ status: 200, message: "sukses", data: data2 });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
    })
  }
  static delete(req, res) {
    const { id } = req.body;
    riwayatPendidikan.destroy({where: {id: id}}).then((data) => {
        res.status(200).json({status: 200,message: "sukses",});
      }).catch((err) => {
        res.status(500).json({ status: 500,message: "gagal",data: err});
      });
  }

}

module.exports = Controller;