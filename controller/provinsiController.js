const provinsi = require( '../model/provinsiModel' );
const sq = require("../config/connection");

class Controller {
    static register( req, res ) {
		const {id,namaProvinsi} = req.body;
		  provinsi.findAll({ where: { id :id, namaProvinsi:namaProvinsi}}).then((data) => {
			  if (data.length) {
				res.status(200).json({ status: 200, message: "data sudah ada" });
			  } else {
				provinsi.create({id,namaProvinsi}).then((data) => {
					res.status(200).json({ status: 200, message: "sukses" });
				  })
			  }
			})
			.catch((err) => {
			  res.status(500).json({ status: 500, message: "gagal", data: err });
			});
}
static list(req, res) {
    provinsi.findAll().then((data) => {
        res.status(200).json({status: 200, message: "sukses", data: data});
      }).catch((err) => {
        res.status(500).json({status: 500, message: "gagal", data: err});
      });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    provinsi.findAll({ where: { id: id } }).then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500,message: "gagal",data: err});
      });
  }

  static update(req, res) {
    const {id, namaProvinsi} = req.body;
    provinsi
      .update({namaProvinsi},{ where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete( req, res ) {
	const {id} = req.body
	provinsi.destroy( {where: {id: id}} ).then( data => {
			res.status( 200 ).json( {status: 200, message: "sukses"} )
		} ).catch( err => {
			res.status( 500 ).json( {status: 500, message: "gagal", data: err} )
		} )
}
}

module.exports = Controller;