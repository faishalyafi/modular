const poolWNA = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
  static register(req, res) {
    const { nomorPassport, nomorKITAS, nomorIMTA,  masaBerlaku, dataKaryawanId } = req.body;
    poolWNA.findAll({ where: { nomorPassport } }).then((data) => {
        if (data.length) {
          res.status(200).json({ status: 200, message: "data sudah ada" });
        } else {
          poolWNA.create({ id: uuid_v4(),nomorPassport, nomorKITAS, nomorIMTA,  masaBerlaku, dataKaryawanId}).then((data2) => {
              res.status(200).json({ status: 200, message: "sukses" });
            });
        }
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }


  // static list(req, res) {
  //   poolWNA.findAll().then((data) => {
  //       res.status(200).json({status: 200, message: "sukses", data: data});
  //     }).catch((err) => {
  //       res.status(500).json({status: 500, message: "gagal", data: err});
  //     });
  // }

  static async list(req, res) {
    let data = await sq.query(`select pw.id as "poolWNAId",pw."nomorPassport" ,pw."nomorKITAS" ,pw."nomorIMTA" ,pw."masaBerlaku" ,dk."namaKaryawan" from "poolWNA" pw 
    join "dataKaryawan" dk on pw."dataKaryawanId" =dk.id 
    where pw."deletedAt" isnull and dk."deletedAt" isnull  `);
    res.status(200).json({status:200,message:"sukses",data:data[0]});
  
  }
  static async detailsById(req, res) {
    const { id } = req.params;
    let data = await sq.query(`select pw.id as "poolWNAId",pw."nomorPassport" ,pw."nomorKITAS" ,pw."nomorIMTA" ,pw."masaBerlaku" ,dk."namaKaryawan"from "poolWNA" pw 
    join "dataKaryawan" dk on pw."dataKaryawanId" =dk.id 
    where pw."deletedAt" isnull and dk."deletedAt" isnull  and pw.id='${id}'`);
    res.status(200).json({status:200,message:"sukses",data:data[0]});
  }
static async detailsByDataKaryawanId(req,res){
  const{dataKaryawanId}=req.params;
  let data = await sq.query(`select * from "poolWNA" pw 
  join "dataKaryawan" dk on pw."dataKaryawanId" =dk.id 
  where pw."deletedAt" isnull and dk."deletedAt" isnull  and  pw."dataKaryawanId" ='${dataKaryawanId}'`);
  res.status(200).json({status:200,message:"sukses",data:data[0]});
}
  static update(req, res) {
    const {id,  nomorPassport, nomorKITAS, nomorIMTA,  masaBerlaku, dataKaryawanId } = req.body;
    poolWNA.update({ nomorPassport, nomorKITAS, nomorIMTA,  masaBerlaku, dataKaryawanId },{ where: { id }, returning: true }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  static delete( req, res ) {
	const {id} = req.body
	poolWNA.destroy( {where: {id: id}} ).then( data => {
			res.status( 200 ).json( {status: 200, message: "sukses"} )
		} ).catch( err => {
			res.status( 500 ).json( {status: 500, message: "gagal", data: err} )
		} )
}
}

module.exports = Controller;