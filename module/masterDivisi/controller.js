const masterDivisi = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
    static register( req, res ) {
		const {namaDivisi,kodeDivisi} = req.body;
		  masterDivisi.findAll({ where: { namaDivisi: namaDivisi } }).then((data) => {
			  if (data.length) {
				res.status(200).json({ status: 200, message: "data sudah ada" });
			  } else {
				masterDivisi.create({id:uuid_v4(),namaDivisi,kodeDivisi}).then((data) => {
					res.status(200).json({ status: 200, message: "sukses" });
				  });
			  }
			}).catch((err) => {
			  res.status(500).json({ status: 500, message: "gagal", data: err });
			});
}
static list(req, res) {
    masterDivisi.findAll().then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500, message: "gagal",data: err});
      });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    masterDivisi.findAll({ where: { id: id } }).then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500, message: "gagal",data: err});
      });
  }

  static update(req, res) {
    const { id, namaDivisi,kodeDivisi } = req.body;
    masterDivisi.update({namaDivisi,kodeDivisi},{ where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete(req, res) {
    const { id } = req.body;
    masterDivisi.destroy({where: {id: id}}).then((data) => {
        res.status(200).json({status: 200,message: "sukses",});
      }).catch((err) => {
        res.status(500).json({ status: 500,message: "gagal",data: err});
      });
  }

}

module.exports = Controller;