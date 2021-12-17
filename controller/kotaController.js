const kota = require( '../model/kotaModel' );
const sq = require("../config/connection");

class Controller {
    static register( req, res ) {
		const {id,namaKota,provinsiId} = req.body;
    // console.log(req.body);
		  kota.findAll({ where: { id :id, namaKota:namaKota}}).then((data) => {
			  if (data.length) {
				res.status(200).json({ status: 200, message: "data sudah ada" });
			  } else {
				kota.create({id,namaKota,provinsiId}).then((data2) => {
					res.status(200).json({ status: 200, message: "sukses" });
				  })
			  }
			})
			.catch((err) => {
			  res.status(500).json({ status: 500, message: "gagal", data: err });
			});
}
static list(req, res) {
    kota.findAll().then((data) => {
        res.status(200).json({status: 200, message: "sukses", data: data});
      }).catch((err) => {
        res.status(500).json({status: 500, message: "gagal", data: err});
      });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    kota.findAll({ where: { id: id } }).then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500,message: "gagal",data: err});
      });
  }
static async listByProvinsiId(req,res){
  const{provinsiId}=req.params;
  let data = await sq.query(`select k3.id as "idKota",k3."namaKota" ,p.id as "idProvinsi", p."namaProvinsi" from kota k3 
  join provinsi p on k3."provinsiId" =p.id
  where k3."deletedAt" isnull and p."deletedAt" isnull and p.id='${provinsiId}'
  order by k3."createdAt"`);
  res.status(200).json({status:200,message:"sukses",data:data[0]});
}
  static update(req, res) {
    const {id, namaKota} = req.body;
    kota.update({namaKota},{ where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete( req, res ) {
	const {id} = req.body
	kota.destroy( {where: {id: id}} ).then( data => {
			res.status( 200 ).json( {status: 200, message: "sukses"} )
		} ).catch( err => {
			res.status( 500 ).json( {status: 500, message: "gagal", data: err} )
		} )
}
}

module.exports = Controller;