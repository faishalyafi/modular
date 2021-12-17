const absensiSales= require('../model/absensiSalesModel')
const { v4: uuid_v4 } = require("uuid");
const moment = require('moment');
const sq = require('../config/connection')

class Controller{

    static async checkIn(req,res){
        const {masterCustomerId,longAbsensi,latAbsensi}=req.body
        let f1=""
        if(req.files){
          if(req.files.file1){
              f1 = req.files.file1[0].filename
          }
      }
      let sudahAbsen= await sq.query(`select * from "absensiSales" as2 where date(as2."createdAt")= current_date and as2."masterUserId" ='${req.dataUsers.id}' and as2."masterCustomerId" ='${masterCustomerId}' and as2."deletedAt" isnull `)

      if (sudahAbsen[0].length){
        res.status(200).json({status: 201,message: "sudah absen"});
      }
      else{
        absensiSales.create({id: uuid_v4(),check:0,masterCustomerId,userId:req.dataUsers.id,longAbsensi,latAbsensi,fotoAbsensi:f1,masterUserId:req.dataUsers.id})
        .then((data) => {
            res.status(200).json({status: 200,message: "sukses"});
          }).catch((err) => {
            res.status(500).json({status: 500,message: "gagal",data: err});
          });
      }

        
    }

    static checkOut(req,res){
        const{id,longCheckout,latCheckout}=req.body

        absensiSales.findAll({where:{
          id:id
        }})
        .then(hasil=>{
          
          if(hasil[0].dataValues.createdAt < moment().subtract(10,'minutes')){
            absensiSales.update({check:1,waktuCheckOut:moment(),longCheckout,latCheckout},{
              where:{
                  id:id
              }
          })
          .then(data => {
              res.status(200).json({status: 200,message: "sukses"});
            })
          }
          else{
            res.status(200).json({status: 201,message: "belum bisa checkOut"});
          }
        })
        .catch((err) => {
          res.status(500).json({status: 500,message: "gagal",data: err});
        })

        
    }

    static async findCheckOut(req,res){
        let data = await sq.query(`select as2.id as "absensiId",as2."createdAt" as "waktuCheckIn",* from "absensiSales" as2 join "masterCustomer" mc on mc.id = as2."masterCustomerId" join "masterKategoriHarga" mkh on mc."masterKategoriHargaId" =mkh.id where as2."deletedAt" isnull and mc."deletedAt" isnull and mkh."deletedAt" isnull and as2."masterUserId" ='${req.dataUsers.id}'  `)
        res.status(200).json({status: 200,message: "sukses",data:data[0]});
    }
    
}

module.exports=Controller