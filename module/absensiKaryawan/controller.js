const { v4: uuid_v4 } = require("uuid");
const sq = require('../../config/connection');
const absensiKaryawan = require('./model');
const karyawan = require('../dataKaryawan/model');
const moment = require('moment');
// const csv = require('csvtojson');
const fs = require('fs');
var parser = require('simple-excel-to-json');


class Controller{
   
    static insert(req,res){
       
        if(req.files){
            let file1 = req.files.file1;
            let filePath = "./asset/file/"+file1.name;

            file1.mv(filePath,async (err)=>{
                if(err){
                    res.json(err);
                }else{
                    let data = parser.parseXls2Json(filePath); 
                    for (let i = 0; i < data[0].length; i++) {
                        data[0][i].tglAbsenKaryawan = moment(data[0][i].tglAbsenKaryawan,"YYYY/MM/DD hh:mm:ss").format();
                        data[0][i].tgl = moment(data[0][i].tglAbsenKaryawan).format("YYYY-MM-DD");
                        data[0][i].jam = moment(data[0][i].tglAbsenKaryawan).format('HH:mm:ss');
                    }

                    const tmp = [...new Map(data[0].map(v => [JSON.stringify([v.dataKaryawanId,v.tgl]), v])).values()]
                    let  bulk = [];
                    let isi = "";

                    for (let j = 0; j < tmp.length; j++) {
                        let min = JSON.parse(JSON.stringify(tmp[j]));
                        let max = JSON.parse(JSON.stringify(tmp[j]));
                       for (let k = 0; k < data[0].length; k++) {
                           if(tmp[j].dataKaryawanId == data[0][k].dataKaryawanId){
                               if(tmp[j].tgl == data[0][k].tgl){
                                   if(data[0][k].jam >= max.jam){
                                    max["dataKaryawanId"] = data[0][k].dataKaryawanId;
                                    max["tglAbsenKaryawan"] = data[0][k].tglAbsenKaryawan;
                                    max["tgl"] = data[0][k].tgl;
                                    max["jam"] = data[0][k].jam;
                                   }
                                   if(data[0][k].jam < min.jam){
                                    min["dataKaryawanId"] = data[0][k].dataKaryawanId;
                                    min["tglAbsenKaryawan"] = data[0][k].tglAbsenKaryawan;
                                    min["tgl"] = data[0][k].tgl;
                                    min["jam"] = data[0][k].jam;
                                   }
                               }
                           }
                       }
                       bulk.push(min);
                       bulk.push(max);
                       if(j>0){
                        isi+=` or dk.id = '${tmp[j].dataKaryawanId}'`;
                        }
                    }

                    let ms =  await sq.query(`select dk.id as "dataKaryawanId",dk."namaKaryawan",dk."masterShiftId",ms."namaShift" from "dataKaryawan" dk join "masterShift" ms on ms.id = dk."masterShiftId" where dk."deletedAt" isnull  and dk.id = '${tmp[0].dataKaryawanId}'${isi}`);
                    let tglB = [];
                    for (let l = 0; l < bulk.length; l++) {
                        bulk[l].id = uuid_v4();
                        tglB.push(bulk[l].tglAbsenKaryawan)
                        for (let m = 0; m < ms[0].length; m++) {
                            if(bulk[l].dataKaryawanId == ms[0][m].dataKaryawanId){
                                bulk[l].ShiftKaryawan = ms[0][m].namaShift;
                            }
                        }
                    }
                    // console.log(bulk);
                    // console.log(tglB);
                    // console.log(isi);
                    // console.log(ms[0]);
                    absensiKaryawan.destroy({where:{tglAbsenKaryawan:tglB}}).then((data2)=>{
                        absensiKaryawan.bulkCreate(bulk).then((data3)=>{
                            fs.unlink(filePath,(err)=>{
                                if(err){
                                    res.json(err);
                                }else{
                                    res.status(200).json({ status: 200, message: "sukses" });
                                }
                            });
                        });
                    }).catch((err)=>{
                        res.status(500).json({ status: 500, message: "gagal", data: err });
                    });
                }
            });
        }else{
            res.status(200).json({ status: 200, message: "file kosong" });
        }
    }

    static register (req,res){
        let {dataKaryawanId,bulkAbsenKaryawan}= req.body;

        karyawan.findAll({where:{id:dataKaryawanId}}).then(async(data)=>{
            if(data.length==0){
                res.status(200).json({status:200,message:"dataKaryawanId tidak ada"});
            }else{
                let data2 = await sq.query(`select * from "masterShift" ms where ms."deletedAt" isnull and ms.id = '${data[0]. masterShiftId}'`);
                for (let i = 0; i < bulkAbsenKaryawan.length; i++) {
                    bulkAbsenKaryawan[i].id = uuid_v4();
                    bulkAbsenKaryawan[i].dataKaryawanId = dataKaryawanId;
                    bulkAbsenKaryawan[i].ShiftKaryawan = data2[0][0].namaShift ;
                }
                // console.log(bulkAbsenKaryawan);
                absensiKaryawan.bulkCreate(bulkAbsenKaryawan).then((data3)=>{
                    res.status(200).json({ status: 200, message: "sukses" });
                });
            }
        }).catch((err)=>{
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static update (req,res){
        const {absensiKaryawanId,tglAbsenKaryawan,dataKaryawanId}= req.body;
        tglAbsenKaryawan = moment(tglAbsenKaryawan,"YYYY/MM/DD hh:mm:ss").format();
        absensiKaryawan.findAll({where:{id:absensiKaryawanId}}).then(async(data)=>{
            if(data.length==0){
                res.status(200).json({status:200,message:"absensiKaryawanId tidak ada"});
            }else{
                let data2 = await sq.query(`select dk.*,ms."namaShift" from "dataKaryawan" dk join "masterShift" ms on ms.id = dk."masterShiftId" where dk."deletedAt" isnull and ms."deletedAt" isnull and dk.id = '${dataKaryawanId}'`);
                if(data2[0].length==0){
                    res.status(200).json({status:200,message:"dataKaryawanId tidak ada"});
                }else{
                    absensiKaryawan.update({tglAbsenKaryawan,dataKaryawanId,ShiftKaryawan:data2[0][0].namaShift},{where:{id:absensiKaryawanId}}).then((data3)=>{
                        res.status(200).json({status:200,message:"sukses"});
                    });
                }
            }
        }).catch((err)=>{
            res.status(500).json({ status: 500, message: "gagal", data: err });
        });
    }

    static delete(req,res){
        const {dataKaryawanId,bulkAbsenKaryawan} = req.body;
        let tgl = [];
        for (let i = 0; i < bulkAbsenKaryawan.length; i++) {
            // tgl.push(moment(bulkAbsenKaryawan[i].tglAbsenKaryawan).format())
            tgl.push(bulkAbsenKaryawan[i].tglAbsenKaryawan)
        }
        // console.log(bulkAbsenKaryawan);
        console.log(tgl);
        
        // absensiKaryawan.findAll({where:{dataKaryawanId,tglAbsenKaryawan:tgl}}).then((data)=>{
        //     if(data.length==0){
        //         res.status(200).json({status:200,message:"data sudah terhapus"});
        //     }else{
                // console.log(data[0]);
                absensiKaryawan.destroy({where:{tglAbsenKaryawan:tgl}}).then((data2)=>{
                    res.status(200).json({status:200,message:"sukses"});
                });
                // res.send("oke");
            // }
        // }).catch((err)=>{
        //     res.status(500).json({ status: 500, message: "gagal", data: err });
        // });
    }

    static async list(req,res){
        let data = await sq.query(`select ak.id as "absensiKaryawanId",ak.*,dk."namaKaryawan",dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",ms."namaShift",ms."jamAwal",ms."jamAkhir" from "absensiKaryawan" ak join "dataKaryawan" dk on dk.id = ak."dataKaryawanId" join "masterShift" ms on ms.id = dk."masterShiftId" join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id  = dk."masterDivisiId" where ak."deletedAt" isnull and dk."deletedAt" isnull group by  dk."namaKaryawan",date(ak."tglAbsenKaryawan"),ms."namaShift",ms."jamAwal",ms."jamAkhir", ak.id, dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi"`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }

    static async listAbsenByDivisi(req,res){
        const {masterDivisiId} = req.params;
        let data =  await sq.query(`select ak.id as "absensiKaryawanId",ak.*,dk."namaKaryawan",dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",ms."namaShift",ms."jamAwal",ms."jamAkhir" from "absensiKaryawan" ak join "dataKaryawan" dk on dk.id = ak."dataKaryawanId" join "masterShift" ms on ms.id = dk."masterShiftId" join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id  = dk."masterDivisiId" where ak."deletedAt" isnull and dk."deletedAt" isnull and md.id = '${masterDivisiId}' group by  dk."namaKaryawan",date(ak."tglAbsenKaryawan"),ms."namaShift",ms."jamAwal",ms."jamAkhir", ak.id, dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi"`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }

    static async listAbsenByPosisi(req,res){
        const {masterPosisiId} = req.params;
        let data =  await sq.query(`select ak.id as "absensiKaryawanId",ak.*,dk."namaKaryawan",dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",ms."namaShift",ms."jamAwal",ms."jamAkhir" from "absensiKaryawan" ak join "dataKaryawan" dk on dk.id = ak."dataKaryawanId" join "masterShift" ms on ms.id = dk."masterShiftId" join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id  = dk."masterDivisiId" where ak."deletedAt" isnull and dk."deletedAt" isnull and  mp.id = '${masterPosisiId}' group by  dk."namaKaryawan",date(ak."tglAbsenKaryawan"),ms."namaShift",ms."jamAwal",ms."jamAkhir", ak.id, dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi"`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }

    static async listAbsenByKaryawanId(req,res){
        const {datakaryawanId} = req.params;
        let data =  await sq.query(`select ak.id as "absensiKaryawanId",ak.*,dk."namaKaryawan",dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",ms."namaShift",ms."jamAwal",ms."jamAkhir" from "absensiKaryawan" ak join "dataKaryawan" dk on dk.id = ak."dataKaryawanId" join "masterShift" ms on ms.id = dk."masterShiftId" join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id  = dk."masterDivisiId" where ak."deletedAt" isnull and dk."deletedAt" isnull and  dk.id = '${datakaryawanId}' group by  dk."namaKaryawan",date(ak."tglAbsenKaryawan"),ms."namaShift",ms."jamAwal",ms."jamAkhir", ak.id, dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi"`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }

    static async listAbsenByBulan(req,res){

        let data = await sq.query(`select ak.id as "absensiKaryawanId",date(ak."tglAbsenKaryawan")as "tglAbsen",to_char(ak."tglAbsenKaryawan" , 'HH24:MI:SS')as"jamAbsen",ak."tglAbsenKaryawan" ,ak."ShiftKaryawan",ak."createdAt",ak."updatedAt",ak."deletedAt",ak."dataKaryawanId",dk."namaKaryawan",dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",dk."masterShiftId",ms."namaShift",ms."jamAwal",ms."jamAkhir" from "absensiKaryawan" ak join "dataKaryawan" dk on dk.id = ak."dataKaryawanId" join "masterShift" ms on ms.id = dk."masterShiftId" join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id  = dk."masterDivisiId" where ak."deletedAt" isnull and dk."deletedAt" isnull and date(ak."tglAbsenKaryawan") between '${new moment().startOf('month').format("YYYY-MM-DD")}' and '${new moment().endOf("month").format("YYYY-MM-DD")}' group by  dk."namaKaryawan",date(ak."tglAbsenKaryawan"),"tglAbsen","jamAbsen",ms."namaShift",ms."jamAwal",ms."jamAkhir", ak.id, dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",dk."masterShiftId"`);
        let tmp = [...new Map(JSON.parse(JSON.stringify(data[0])).map(item => [item['dataKaryawanId'], item])).values()];
        let data2 = [];
        let hasil = [];

        console.log(data[0]);
        // console.log(data2.length);
        // console.log(data2);
        // console.log(hasil.length);
        // console.log(hasil);
        // console.log(tmp);
        res.status(200).json({status:200,message:"sukses",data:hasil});
    }

    static async searchAbsen(req,res){
        let {tglAwal,tglAkhir,masterPosisiId,masterDivisiId} = req.body;
        let masterPosisi = ` and mp.id = '${masterPosisiId}`;
        let masterDivisi = ` and md.id = '${masterDivisiId}'`;
        if(!tglAwal){
            tglAwal = new moment().startOf('month').format("YYYY-MM-DD");
        }
        if(!tglAkhir){
            tglAkhir = new moment().endOf("month").format("YYYY-MM-DD");
        }
        if(!masterPosisiId){
            masterPosisi="";
        }
        if(!masterDivisiId){
            masterDivisi="";
        }
        // console.log(tglAwal);
        // console.log(tglAkhir);
        // console.log(masterPosisi);
        // console.log(masterDivisi);

        let data =  await sq.query(`select ak.id as "absensiKaryawanId",date(ak."tglAbsenKaryawan")as "tglAbsen",to_char(ak."tglAbsenKaryawan" , 'HH24:MI:SS')as"jamAbsen",ak."tglAbsenKaryawan" ,ak."ShiftKaryawan",ak."createdAt",ak."updatedAt",ak."deletedAt",ak."dataKaryawanId",dk."namaKaryawan",dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",dk."masterShiftId",ms."namaShift",ms."jamAwal",ms."jamAkhir" from "absensiKaryawan" ak join "dataKaryawan" dk on dk.id = ak."dataKaryawanId" join "masterShift" ms on ms.id = dk."masterShiftId" join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id  = dk."masterDivisiId" where ak."deletedAt" isnull and dk."deletedAt" isnull and date(ak."tglAbsenKaryawan") between '${tglAwal}' and '${tglAkhir}'${masterPosisi}${masterDivisi} group by  dk."namaKaryawan",date(ak."tglAbsenKaryawan"),"tglAbsen","jamAbsen",ms."namaShift",ms."jamAwal",ms."jamAkhir",ak.id, dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",dk."masterShiftId"`)
        
        console.log(data[0].length);
        console.log(data[0]);
        res.send("oke");
    }
}

module.exports=Controller

// static insert(req,res){
       
    //     if(req.files){
    //         let file1 = req.files.file1;
    //         let filePath = "./asset/file/"+file1.name;

    //         file1.mv(filePath,async (err)=>{
    //             if(err){
    //                 res.json(err);
    //             }else{
    //                 let data = parser.parseXls2Json(filePath); 
    //                 let tmp = [...new Map(data[0].map(item => [item['dataKaryawanId'], item])).values()];
    //                 let  bulk = [];
    //                 let isi = "";

    //                 for (let i = 0; i < tmp.length; i++) {
    //                     let min = JSON.parse(JSON.stringify(tmp[i]));
    //                     let max = JSON.parse(JSON.stringify(tmp[i]));
    //                     for (let j = 0; j < data[0].length; j++) {
    //                         if(tmp[i].dataKaryawanId==data[0][j].dataKaryawanId){
    //                             if(moment(data[0][j].tglAbsenKaryawan).format('HH:mm:ss') >= moment(max.tglAbsenKaryawan).format('HH:mm:ss')){
    //                                 max["dataKaryawanId"] = data[0][j].dataKaryawanId;
    //                                 max["tglAbsenKaryawan"] = data[0][j].tglAbsenKaryawan;
    //                             }
    //                             if(moment(data[0][j].tglAbsenKaryawan).format('HH:mm:ss') < moment(min.tglAbsenKaryawan).format('HH:mm:ss')){
    //                                 min["dataKaryawanId"] = data[0][j].dataKaryawanId;
    //                                 min["tglAbsenKaryawan"] = data[0][j].tglAbsenKaryawan;
    //                             }
    //                         }
    //                     }
    //                     bulk.push(min);
    //                     bulk.push(max);
    //                     if(i>0){
    //                         isi+=` or dk.id = '${tmp[i].dataKaryawanId}'`;
    //                     }
    //                 }
    //                 let ms =  await sq.query(`select dk.id as "dataKaryawanId",dk."namaKaryawan",dk."masterShiftId",ms."namaShift" from "dataKaryawan" dk join "masterShift" ms on ms.id = dk."masterShiftId" where dk."deletedAt" isnull  and dk.id = '${tmp[0].dataKaryawanId}'${isi}`);
    //                 // console.log("==============================");
    //                 // console.log(bulk);
    //                 // console.log("==============================");
    //                 // console.log(ms[0]);
    //                 // console.log("==============================");
    //                 let tgl = []
    //                 for (let k = 0; k < bulk.length; k++) {
    //                     bulk[k].id = uuid_v4();
    //                     tgl.push(bulk[k].tglAbsenKaryawan)
    //                     for (let l = 0; l < ms[0].length; l++) {
    //                         if(bulk[k].dataKaryawanId == ms[0][l].dataKaryawanId){
    //                             bulk[k].ShiftKaryawan = ms[0][l].namaShift;
    //                         }
    //                     }
    //                 }
    //                 absensiKaryawan.destroy({where:{tglAbsenKaryawan:tgl}}).then((data2)=>{
    //                     absensiKaryawan.bulkCreate(bulk).then((data3)=>{
    //                         fs.unlink(filePath,(err)=>{
    //                             if(err){
    //                                 res.json(err);
    //                             }else{
    //                                 res.status(200).json({ status: 200, message: "sukses" });
    //                             }
    //                         });
    //                     })
    //                 }).catch((err)=>{
    //                     res.status(500).json({ status: 500, message: "gagal", data: err });
    //                 });
    //             }
    //         });
    //     }else{
    //         res.status(200).json({ status: 200, message: "file kosong" });
    //     }
    // }

    // static register (req,res){
    //     let {dataKaryawanId,bulkAbsenKaryawan}= req.body;

    //     tglAbsenKaryawan = moment(tglAbsenKaryawan,"YYYY/MM/DD hh:mm:ss").format();
    //     karyawan.findAll({where:{id:dataKaryawanId}}).then(async(data)=>{
    //         if(data.length==0){
    //             res.status(200).json({status:200,message:"dataKaryawanId tidak ada"});
    //         }else{
    //             let data2 = await sq.query(`select * from "masterShift" ms where ms."deletedAt" isnull and ms.id = '${data[0]. masterShiftId}'`);
    //             absensiKaryawan.create({id:uuid_v4(),tglAbsenKaryawan,dataKaryawanId,ShiftKaryawan:data2[0][0].namaShift}).then((data3)=>{
    //                 res.status(200).json({ status: 200, message: "sukses" });
    //             });
    //         }
    //     }).catch((err)=>{
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     });
    // }

    // static delete(req,res){
    //     const {absensiKaryawanId} = req.body;
        
    //     absensiKaryawan.findAll({where:{id:absensiKaryawanId}}).then((data)=>{
    //         if(data.length==0){
    //             res.status(200).json({status:200,message:"data sudah terhapus"});
    //         }else{
    //             absensiKaryawan.destroy({where:{id:absensiKaryawanId}}).then((data2)=>{
    //                 res.status(200).json({status:200,message:"sukses"});
    //             });
    //         }
    //     }).catch((err)=>{
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     });
    // }

    // static async listAbsenByBulan(req,res){

    //     let data = await sq.query(`select ak.id as "absensiKaryawanId",date(ak."tglAbsenKaryawan")as "tglAbsen",to_char(ak."tglAbsenKaryawan" , 'HH24:MI:SS')as"jamAbsen",ak."tglAbsenKaryawan" ,ak."ShiftKaryawan",ak."createdAt",ak."updatedAt",ak."deletedAt",ak."dataKaryawanId",dk."namaKaryawan",dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",dk."masterShiftId",ms."namaShift",ms."jamAwal",ms."jamAkhir" from "absensiKaryawan" ak join "dataKaryawan" dk on dk.id = ak."dataKaryawanId" join "masterShift" ms on ms.id = dk."masterShiftId" join "masterPosisi" mp on mp.id = dk."masterPosisiId" join "masterDivisi" md on md.id  = dk."masterDivisiId" where ak."deletedAt" isnull and dk."deletedAt" isnull and date(ak."tglAbsenKaryawan") between '${new moment().startOf('month').format("YYYY-MM-DD")}' and '${new moment().endOf("month").format("YYYY-MM-DD")}' group by  dk."namaKaryawan",date(ak."tglAbsenKaryawan"),"tglAbsen","jamAbsen",ms."namaShift",ms."jamAwal",ms."jamAkhir", ak.id, dk."masterPosisiId",mp."namaPosisi",dk."masterDivisiId",md."namaDivisi",dk."masterShiftId"`);
    //     let tmp = [...new Map(JSON.parse(JSON.stringify(data[0])).map(item => [item['dataKaryawanId'], item])).values()];
    //     let jadwal = [...new Map(data[0].map(v => [JSON.stringify([v.dataKaryawanId,v.tglAbsen]), v])).values()];
    //     let data2 = [];
    //     let hasil = [];

    //     for (let i = 0; i < data[0].length; i++) {
    //         let isi = true;
    //         for (let j = 0; j < jadwal.length; j++) {
    //             if(data[0][i].dataKaryawanId == jadwal[j].dataKaryawanId && data[0][i].tglAbsen == jadwal[j].tglAbsen){
    //                 if(data[0][i].jamAbsen == jadwal[j].jamAbsen){
    //                     data[0][i].jamAbsen2 = 0;
    //                     break;
    //                 }
    //                 data[0][i].jamAbsen2 = jadwal[j].jamAbsen
    //             }
    //         }
    //         if(data2.length){
    //             for (let k = 0; k < data2.length; k++) {
    //                 if(data[0][i].dataKaryawanId == data2[k].dataKaryawanId && data[0][i].tglAbsen == data2[k].tglAbsen){
    //                     isi = false;
    //                 }
    //             }   
    //         }
    //         if(isi){
    //         data2.push(data[0][i]);
    //         }
    //     }

    //     for (let l = 0; l < tmp.length; l++) {
    //         let x = {
    //                 dataKaryawanId :tmp[l].dataKaryawanId,
    //                 namaKaryawan :tmp[l].namaKaryawan,
    //                 masterPosisiId :tmp[l].masterPosisiId,
    //                 namaPosisi :tmp[l].namaPosisi,
    //                 masterDivisiId :tmp[l].masterDivisiId,
    //                 namaDivisi :tmp[l].namaDivisi,
    //                 masterShiftId :tmp[l].masterShiftId,
    //                 namaShift :tmp[l].namaShift,
    //                 jamAwal :tmp[l].jamAwal,
    //                 jamAkhir :tmp[l].jamAkhir,
    //                 absen:[]
    //                 };
    //         for (let m = 0; m < 31; m++) {
    //             let y ={
    //                     tgl : `${moment().format("YYYY-MM")}-0${m+1}`,
    //                     jamMasuk : 0,
    //                     jamPulang : 0,
    //                     tglAbsenKaryawan : 0,
    //                     ShiftKaryawan : "",
    //                     }
    //             if(m>8){
    //                 y.tgl = `${moment().format("YYYY-MM")}-${m+1}`;
    //             }
    //             for (let n = 0; n < data2.length; n++) {
    //                 if(x.dataKaryawanId == data2[n].dataKaryawanId && y.tgl == data2[n].tglAbsen){
    //                     y.jamMasuk = data2[n].jamAbsen;
    //                     y.jamPulang = data2[n].jamAbsen2;
    //                     y.tglAbsenKaryawan = data2[n].tglAbsenKaryawan;
    //                     y.ShiftKaryawan = data2[n].ShiftKaryawan;
    //                 }
    //             }
    //             x.absen.push(y);
    //         }
    //         hasil.push(x);
    //     }
