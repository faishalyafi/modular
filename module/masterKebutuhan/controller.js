const masterKebutuhan= require("./model");

const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
    static register( req, res ) {
		const {namaKebutuhan} = req.body;
		  masterKebutuhan.findAll({ where: { namaKebutuhan: namaKebutuhan } }).then((data) => {
			  if (data.length) {
				res.status(200).json({ status: 200, message: "data sudah ada" });
			  } else {
				masterKebutuhan.create({id:uuid_v4(),namaKebutuhan,}).then((data) => {
					res.status(200).json({ status: 200, message: "sukses" });
				  });
			  }
			}).catch((err) => {
			  res.status(500).json({ status: 500, message: "gagal", data: err });
			});
}
static list(req, res) {
    masterKebutuhan.findAll().then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data,});
      })
      .catch((err) => {
        res.status(500).json({status: 500,message: "gagal",data: err,});
      });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    masterKebutuhan.findAll({ where: { id: id } }).then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500,message: "gagal",data: err,});
      });
  }
  static detailsByToko(req, res) {
    const { namaKebutuhan } = req.params;
    // console.log(req.params);
    masterKebutuhan.findAll({ where: { namaKebutuhan: namaKebutuhan } }).then((data) => {
        res.status(200).json({ status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500,message: "gagal",data: err});
      });
  }
  static update(req, res) {
    const { id, namaKebutuhan } = req.body;
    masterKebutuhan.update({namaKebutuhan}, { where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete(req, res) {
    const { id } = req.body;
    masterKebutuhan.destroy({where: {id: id}}).then((data) => {
        res.status(200).json({status: 200,message: "sukses"});
      }).catch((err) => {
        res.status(500).json({status: 500,message: "gagal",data: err});
      });
  }


}

module.exports = Controller;
