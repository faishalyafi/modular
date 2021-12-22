const poolTahapan = require("./model");
const postLoker=require("../postLoker/model")
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
  
  static register(req,res){
    const { nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,masterTahapanId,postLokerId} = req.body;

    poolTahapan.create({ id: uuid_v4(), nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,masterTahapanId,postLokerId }).then((data1) => {
      res.status(200).json({ status: 200, message: "sukses" });
    }).catch((err)=>{
      res.status(500).json({ status: 500, message: "gagal", data: err });
    })
  }
  // static register(req, res) {
  //   const { nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,masterTahapanId,postLokerId} = req.body;
  //   poolTahapan.findAll({ where: { postLokerId: postLokerId } }).then((data) => {
  //     if (data.length) {
  //       res.status(200).json({ status: 200, message: "data sudah ada" });
  //     } else {
  //       poolTahapan.create({ id: uuid_v4(), nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,masterTahapanId,postLokerId }).then((data1) => {
  //         res.status(200).json({ status: 200, message: "sukses" });
  //       });
  //     }
  //   }).catch((err) => {
  //     res.status(500).json({ status: 500, message: "gagal", data: err });
  //   });
  // }
  static list(req, res) {
      poolTahapan.findAll().then((data) => {
          res.status(200).json({status: 200,message: "sukses",data: data});
        }).catch((err) => {
          res.status(500).json({status: 500, message: "gagal",data: err});
        });
    }


  static detailsById(req, res) {
    const { id } = req.params;
    poolTahapan.findAll({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", data: data });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static update(req, res) {
    const { id, nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,statusTahapan,masterTahapanId,postLokerId } = req.body;
    poolTahapan.update({ nilaiPoolTahapan,keteranganPoolTahapan,tanggalPemanggilan,statusTahapan,masterTahapanId,postLokerId }, { where: { id }, returning: true }).then((data) => {
      if(req.body.statusTahapan == 2){
        postLoker.update({statusPostLoker : 2}, { where: { id:postLokerId }, returning: true }).then((data1) => {
          res.status(200).json({ status: 200, message: "sukses", data: data[1] })
        }).catch((err) => {
          console.log("if error");
          res.status(500).json({ status: 500, message: "gagal", data: err });
        });
      }else{
        res.status(200).json({ status: 200, message: "sukses", data: data[1] })
      }
    }).catch((err) => {
      console.log("error");
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }
  static delete(req, res) {
    const { id } = req.body;
    poolTahapan.destroy({ where: { id: id } }).then((data) => {
      res.status(200).json({ status: 200, message: "sukses", });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "gagal", data: err });
    });
  }

  static async listTahapanByPostLokerId(req,res){
    const {postLokerId}= req.params

    let data = await sq.query(`select pt.id as "poolTahapanId",pt."nilaiPoolTahapan",pt."keteranganPoolTahapan",pt."tanggalPemanggilan",pt."statusTahapan",pt."masterTahapanId",mt."namaTahapan",pt."postLokerId",pl."namaPengirim",pl."emailPengirim",pl."statusPostLoker" from "poolTahapan" pt join "masterTahapan" mt on mt.id = pt."masterTahapanId" join "postLoker" pl on pl.id = pt."postLokerId" where pt."deletedAt" isnull and mt."deletedAt" isnull and pl."deletedAt" isnull  and pt."postLokerId" = '${postLokerId}' order by pt."createdAt" `)
    res.status(200).json({status:200,message:"sukses",data:data[0]});
  }

}

module.exports = Controller;