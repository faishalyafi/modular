const kecamatan = require( '../model/kecamatanModel' );
const sq = require("../config/connection");

class Controller {
    static register( req, res ) {
		const {id,namaKecamatan,kotumId} = req.body;
		  kecamatan.findAll({ where: { id :id, namaKecamatan:namaKecamatan}}).then((data) => {
			  if (data.length) {
				res.status(200).json({ status: 200, message: "data sudah ada" });
			  } else {
				kecamatan.create({id,namaKecamatan,kotumId}).then((data2) => {
					res.status(200).json({ status: 200, message: "sukses" });
				  })
			  }
			})
			.catch((err) => {
			  res.status(500).json({ status: 500, message: "gagal", data: err });
			});
}
static list(req, res) {
    kecamatan.findAll().then((data) => {
        res.status(200).json({status: 200, message: "sukses", data: data});
      }).catch((err) => {
        res.status(500).json({status: 500, message: "gagal", data: err});
      });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    kecamatan.findAll({ where: { id: id } }).then((data) => {
        res.status(200).json({status: 200,message: "sukses",data: data});
      }).catch((err) => {
        res.status(500).json({status: 500,message: "gagal",data: err});
      });
  }
static async listByKotaId(req,res){
  const{kotumId}=req.params;
  let data = await sq.query(`select k2.id as "idKecamatan",k2."namaKecamatan" ,k3.id as "idKota", k3."namaKota" from kecamatan k2 
  join kota k3 on k2."kotumId" =k3.id
  where k2."deletedAt" isnull and k3."deletedAt" isnull and k3.id='${kotumId}'
  order by k2."createdAt"`);
  res.status(200).json({status:200,message:"sukses",data:data[0]});
}
  static update(req, res) {
    const {id, namaKecamatan,kotumId} = req.body;
    kecamatan
      .update({namaKecamatan,kotumId},{ where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete( req, res ) {
	const {id} = req.body
	kecamatan.destroy( {where: {id: id}} ).then( data => {
			res.status( 200 ).json( {status: 200, message: "sukses"} )
		} ).catch( err => {
			res.status( 500 ).json( {status: 500, message: "gagal", data: err} )
		} )
}
}

module.exports = Controller;