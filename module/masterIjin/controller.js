const masterIjin = require( './model' );
const sq = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");

class Controller {
    static register( req, res ) {
		const {namaIjin} = req.body;
		  masterIjin.findAll({ where: { namaIjin :namaIjin}}).then((data) => {
			  if (data.length) {
				res.status(200).json({ status: 200, message: "data sudah ada" });
			  } else {
				masterIjin.create({id: uuid_v4(),namaIjin}).then((data1) => {
					res.status(200).json({ status: 200, message: "sukses" });
				  })
			  }
			})
			.catch((err) => {
			  res.status(500).json({ status: 500, message: "gagal", data: err });
			});
}
static list(req, res) {
    masterIjin.findAll().then((data) => {
        res.status(200).json({status: 200, message: "sukses", data: data});
      }).catch((err) => {
        res.status(500).json({status: 500, message: "gagal", data: err});
      });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    masterIjin.findAll({ where: { id: id } }).then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500,message: "gagal",data: err});
      });
  }

  static update(req, res) {
    const {id, namaIjin} = req.body;
    masterIjin.update({namaIjin},{ where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete( req, res ) {
	const {id} = req.body
	masterIjin.destroy( {where: {id: id}} ).then( data => {
			res.status( 200 ).json( {status: 200, message: "sukses"} )
		} ).catch( err => {
			res.status( 500 ).json( {status: 500, message: "gagal", data: err} )
		} )
}
}

module.exports = Controller;