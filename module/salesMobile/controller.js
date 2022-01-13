const user = require('../masterUser/controller')
const customer = require('../masterCustomer/model')
const sq = require('../../config/connection')
const { v4: uuid_v4 } = require("uuid");
const moment= require('moment')

class Controller{

    static async jumlahTokoBySalesLogin(req,res){
        let belumOrder =await sq.query(`select * from "masterCustomer" mc2 where mc2.id not in(select distinct mc.id from "masterCustomer" mc  join "OP" o ON mc.id = o."masterCustomerId" where mc."masterUserId" = '${req.dataUsers.id}' and date_part('month',o."tanggalOrderOP" ) =${moment().format('M')} and date_part('year',o."tanggalOrderOP" ) = ${moment().format('Y')} and o.id notnull and mc."deletedAt" isnull and o."deletedAt" isnull and mc."statusSurvey" =2) and mc2."masterUserId" = '${req.dataUsers.id}' and mc2."statusSurvey" =2 and mc2."deletedAt" isnull `)
       
        let sudahOrder = await sq.query(`select distinct mc.* from "masterCustomer" mc  join "OP" o ON mc.id = o."masterCustomerId" where mc."masterUserId" = '${req.dataUsers.id}' and date_part('month',o."tanggalOrderOP" ) =${moment().format('M')} and date_part('year',o."tanggalOrderOP" ) = ${moment().format('Y')} and o.id notnull and mc."deletedAt" isnull and o."deletedAt" isnull and mc."statusSurvey" =2`)

        let belumDisurvey = await sq.query(`select * from "masterCustomer" mc where mc."statusSurvey"=1 and "masterUserId"='${req.dataUsers.id}' and mc."deletedAt" isnull`)

        res.status(200).json({ status: 200, message: "sukses",belumOrder:belumOrder[0],sudahOrder:sudahOrder[0],belumDisurvey:belumDisurvey[0] });
    }

    static async totalOmsetBySalesLogin(req,res){
        let totalOP = await sq.query(`select sum("totalHargaOP") from "OP" o where o."masterUserId"  = '${req.dataUsers.id}' and o."deletedAt" isnull `)
        let totalTransaksiOP = await sq.query(`select sum(sto."hargaTotalOP") from "transaksiOP" to2 join "subTransaksiOP" sto ON  to2.id = sto."transaksiOPId"  where to2."masterUserId" ='${req.dataUsers.id}' and to2."deletedAt" isnull and sto."deletedAt" isnull and date_part('month',to2."tanggalPengirimanOP"  ) = ${moment().format('M')} and date_part('year',to2."tanggalPengirimanOP" ) = ${moment().format('Y')} `)
        
        res.status(200).json({ status: 200, message: "sukses",totalOmset:totalOP[0][0].sum,totalOmsetTerkirim:totalTransaksiOP[0][0].sum});
    }

    static async tokoTerbaikBySalesLogin(req,res){
        let data = await sq.query(`select sum("totalHargaOP") as "totalPenjualan",mc.* from "OP" o join "masterCustomer" mc on o."masterCustomerId" =mc.id  where o."masterUserId" = '${req.dataUsers.id}' and mc."deletedAt" isnull and o."deletedAt" isnull group by mc.id order by "totalPenjualan" desc `)
        res.status(200).json({ status: 200, message: "sukses",data:data[0]});
    }

    static registerToko( req, res ) {
		const { namaCustomer,alamatLengkap,masterKategoriCustomerId,kodePos,nomorTelepon,email,longitude,latitude,provinsi,kota,kecamatan,fax,masterUserId,statusSurvey,masterKategoriHargaId } = req.body;
        let f1=""

        if(!masterUserId){
			masterUserId = req.dataUsers.id;
		}

        if(req.files){
            if(req.files.file1){
                f1 = req.files.file1[0].filename
            }
        }
		// console.log(req.body);
		customer.create({id: uuid_v4(),namaCustomer,alamatLengkap,masterKategoriCustomerId,kodePos,nomorTelepon,email,longitude,latitude,provinsi,kota,kecamatan,fax,masterUserId,fotoCustomer:f1,statusSurvey,masterKategoriHargaId})
		.then((data) => {
			res.status(200).json( {status: 200, message: "sukses", data: data});})
		.catch( (err) => {
			res.status( 500 ).json({status: 500,message: "gagal",data: err});
		});
	}

    static async updateToko( req, res ) {
		const { id,namaCustomer,alamatLengkap,masterKategoriCustomerId,kodePos,nomorTelepon,email,longitude,latitude,provinsi,kota,kecamatan,fax,masterUserId,statusSurvey,masterKategoriHargaId} = req.body;
        
        if(!masterUserId){
			masterUserId = req.dataUsers.id;
		}
        if(req.files){
            if(req.files.file1){
                await sq.query(`update masterCustomer SET "fotoCustomer" ='${req.files.file1[0].filename}' where id = ${id}`)
            }
        }

		customer.update({namaCustomer,alamatLengkap,masterKategoriCustomerId,kodePos,nomorTelepon,email,longitude,latitude,provinsi,kota,kecamatan,fax,masterUserId,statusSurvey,masterKategoriHargaId}, {where: {id: id}})
		.then((data) => {
			res.status( 200 ).json({status: 200,message: "sukses"})})
		.catch( (err) => {
			res.status( 500 ).json( {status: 500,message: "gagal",data: err})
		});
	}
    

    static async totalOmset(req,res){
        let tanggal=moment().format('YYYY-MM-DD')
        let x = ""
        const {range}= req.params
        

        if(range=='harian'){
            x=`and DATE(o."tanggalOrderOP") = '${tanggal}'`
        }
        if(range=='bulanan'){
            x = `and date_part('month', o."tanggalOrderOP" ) = date_part('month', '${tanggal}') and date_part('year', o."tanggalOrderOP") = date_part('year', '${tanggal}')`
        }

        if(range=='7hari'){
            x= `and o."tanggalOrderOP" <= '${tanggal}' and o."tanggalOrderOP"  >=  '${tanggal}' - interval '6 days'`
        }
        if(range=='30hari'){
            x= `and o."tanggalOrderOP"  <= '${tanggal}' and o."tanggalOrderOP"  >=  '${tanggal}' - interval '29 days'`
        }
        if(range=='90hari'){
            x= `and o."tanggalOrderOP"  <= '${tanggal}' and o."tanggalOrderOP"  >=  '${tanggal}' - interval '89 days'`
        }
       
        let data = await sq.query(`select sum(o."totalHargaOP") as "totalPenjualan"  from "masterCustomer" mc join "OP" o on mc.id = o."masterCustomerId" where mc."statusSurvey" =2 and o."masterUserId" ='${req.dataUsers.id}'  and o."deletedAt" isnull and mc."deletedAt" isnull `+x)
        

        res.status(200).json( {status: 200, message: "sukses", data: data[0]})
    }

    

    static async listTokoByStatusAndSalesLogin(req,res){
        const {statusSurvey}= req.params
        let data = await sq.query(`select mc.id as "masterCustomerId",* from "masterCustomer" mc join "masterKategoriCustomer" mkc on mc."masterKategoriCustomerId" = mkc.id where mc."masterUserId" = '${req.dataUsers.id}' and mc."statusSurvey" =${statusSurvey} and mc."deletedAt" isnull `)
        res.status(200).json({status: 200, message: "sukses", data: data[0]})
    }

    static async jumlahRiwayatPembelianToko(req,res){
        const{masterCustomerId}= req.params
        let data = await sq.query(`select mb2.*,(select sum(so."jumlahBarangSubOP") from "masterBarang" mb  join "subOP" so on so."masterBarangId"= mb.id join "OP" o on o.id = so."OPId" where o."masterCustomerId" ='${masterCustomerId}' and mb.id = mb2.id and o."deletedAt" isnull and so."deletedAt" isnull and mb."deletedAt" isnull) from "masterBarang" mb2 where mb2."deletedAt" isnull   `)
        res.status(200).json({status: 200, message: "sukses", data: data[0]})
    }

    static async rekapProdukPerToko(req,res){
        const{masterBarangId,masterCustomerId}= req.params
        let data = await sq.query(`select so.id as "SOId",* from "masterBarang" mb join "subOP" so on mb.id = so."masterBarangId" join "OP" o on o.id=so."OPId" where mb.id = '${masterBarangId}' and o."masterCustomerId" = '${masterCustomerId}' and mb."deletedAt" isnull and o."deletedAt" isnull and so."deletedAt" isnull order by o."tanggalOrderOP" desc `)
        
        res.status(200).json({status: 200, message: "sukses", data: data[0]})
    }

    static async listCustomerBySalesMobile(req,res){
        let {halaman}=req.params
        let data =""
        let data2=""
        let sisa =false

        if(halaman=="all"){
            data = await sq.query(`select * from "masterCustomer" mc where mc."masterUserId" ='${req.dataUsers.id}' and mc."deletedAt" isnull order by id`)
        }
        else{
            let offset= +halaman * 10
            let offset2 = (+halaman + 1)*10
            

            data = await sq.query(`select * from "masterCustomer" mc where mc."masterUserId" ='${req.dataUsers.id}' and mc."deletedAt" isnull order by id limit 10 offset ${offset}`)

            data2 = await sq.query(`select * from "masterCustomer" mc where mc."masterUserId" ='${req.dataUsers.id}' and mc."deletedAt" isnull order by id limit 10 offset ${offset2}`)

            if(data2[0].length > 0){
                sisa=true
            }
        }
        res.status(200).json({ status: 200, message: "sukses",data:data[0],sisa})

    }

    static async listCustomerBelumApprove(req,res){
        const{halaman}=req.params
        let offset= +halaman * 10
        let offset2 = (+halaman + 1)*10
        let sisa = true

        let data = await sq.query(`select * from "masterCustomer" mc where mc."statusSurvey"=1 and "masterUserId"='${req.dataUsers.id}' and mc."deletedAt" isnull order by id limit 10 offset ${offset}`)

        let data2 = await sq.query(`select * from "masterCustomer" mc where mc."statusSurvey"=1 and "masterUserId"='${req.dataUsers.id}' and mc."deletedAt" isnull order by id limit 10 offset ${offset2}`)

        if(data2[0].length==0){
            sisa=false
        }
        res.status(200).json({ status: 200, message: "sukses",data:data[0],sisa})
    }

    static async listCustomersudahOrder(req,res){
        const{halaman}=req.params
        let offset= +halaman * 10
        let offset2 = (+halaman + 1)*10
        let sisa = true

        let data = await sq.query(`select distinct mc.* from "masterCustomer" mc  join "OP" o ON mc.id = o."masterCustomerId" where mc."masterUserId" = '${req.dataUsers.id}' and date_part('month',o."tanggalOrderOP" ) =${moment().format('M')} and date_part('year',o."tanggalOrderOP" ) = ${moment().format('Y')} and o.id notnull and mc."deletedAt" isnull and o."deletedAt" isnull and mc."statusSurvey" =2 order by mc.id limit 10 offset ${offset}`)

        let data2 = await sq.query(`select distinct mc.* from "masterCustomer" mc  join "OP" o ON mc.id = o."masterCustomerId" where mc."masterUserId" = '${req.dataUsers.id}' and date_part('month',o."tanggalOrderOP" ) =${moment().format('M')} and date_part('year',o."tanggalOrderOP" ) = ${moment().format('Y')} and o.id notnull and mc."deletedAt" isnull and o."deletedAt" isnull and mc."statusSurvey" =2 order by mc.id limit 10 offset ${offset2}`)

        if(data2[0].length==0){
            sisa=false
        }
        res.status(200).json({ status: 200, message: "sukses",data:data[0],sisa})
    }

    static async listCustomerBelumOrder(req,res){
        const{halaman}=req.params
        let offset= +halaman * 10
        let offset2 = (+halaman + 1)*10
        let sisa = true

        let data = await sq.query(`select * from "masterCustomer" mc2 where mc2.id not in(select distinct mc.id from "masterCustomer" mc  join "OP" o ON mc.id = o."masterCustomerId" where mc."masterUserId" = '${req.dataUsers.id}' and date_part('month',o."tanggalOrderOP" ) =${moment().format('M')} and date_part('year',o."tanggalOrderOP" ) = ${moment().format('Y')} and o.id notnull and mc."deletedAt" isnull and o."deletedAt" isnull and mc."statusSurvey" =2) and mc2."masterUserId" = '${req.dataUsers.id}' and mc2."statusSurvey" =2 and mc2."deletedAt" isnull   order by mc2.id limit 10 offset ${offset}`)

        let data2 = await sq.query(`select * from "masterCustomer" mc2 where mc2.id not in(select distinct mc.id from "masterCustomer" mc  join "OP" o ON mc.id = o."masterCustomerId" where mc."masterUserId" = '${req.dataUsers.id}' and date_part('month',o."tanggalOrderOP" ) =${moment().format('M')}  and date_part('year',o."tanggalOrderOP" ) = ${moment().format('Y')} and o.id notnull and mc."deletedAt" isnull and o."deletedAt" isnull and mc."statusSurvey" =2) and mc2."masterUserId" = '${req.dataUsers.id}' and mc2."statusSurvey" =2 and mc2."deletedAt" isnull   order by mc2.id limit 10 offset ${offset2}`)

        if(data2[0].length==0){
            sisa=false
        }
        res.status(200).json({ status: 200, message: "sukses",data:data[0],sisa})
    }



    static async listOPBySalesMobile(req,res){
        const{halaman}=req.params
        let offset= +halaman * 10
        let offset2 = (+halaman + 1)*10
        let sisa = true

        let data = await sq.query(`select o.id as OPId,* from "OP" o  join "masterCustomer" mc on o."masterCustomerId" = mc.id where o."masterUserId" ='${req.dataUsers.id}' and o."statusOP" =0 and o."deletedAt" isnull  order by o."createdAt" desc limit 10 offset ${offset}`)

        let data2 = await sq.query(`select o.id as OPId,* from "OP" o  join "masterCustomer" mc on o."masterCustomerId" = mc.id where o."masterUserId" ='${req.dataUsers.id}' and o."statusOP" =0 and o."deletedAt" isnull  order by o."createdAt" desc limit 10 offset ${offset2}`)

        if(data2[0].length==0){
            sisa=false
        }
        res.status(200).json({ status: 200, message: "sukses",data:data[0],sisa})
    }

    static async listJadwalPengirimanMobile(req,res){
        const{halaman}=req.params
        let offset= +halaman * 10
        let offset2 = (+halaman + 1)*10
        let sisa = true
        let jam = +moment().format('hhmmss')
        let tanggal=moment().format ('YYYY-MM-DD')
        
        if(jam>170000){
            tanggal = moment().add(1,'day').format ('YYYY-MM-DD')
        }
        console.log(tanggal)
        let data = await sq.query(`select to2.id as"transaksiId",* from "transaksiOP" to2 join "OP" o ON o.id = to2."OPId" join "masterCustomer" mc on o."masterCustomerId" = mc.id where to2."tanggalPengirimanOP" >= '${tanggal}' and o."masterUserId" = '${req.dataUsers.id}' and to2."pembatalanTransaksiOP" isnull and o."deletedAt" isnull and to2."deletedAt" isnull order by to2."tanggalPengirimanOP"  limit 10 offset ${offset}`)

        let data2 = await sq.query(`select * from "transaksiOP" to2 join "OP" o ON o.id = to2."OPId" join "masterCustomer" mc on o."masterCustomerId" = mc.id where to2."tanggalPengirimanOP" > '${tanggal}' and o."masterUserId" = '${req.dataUsers.id}' and to2."pembatalanTransaksiOP" isnull and o."deletedAt" isnull and to2."deletedAt" isnull order by to2."tanggalPengirimanOP"  limit 10 offset ${offset2}`)

        if(data2[0].length==0){
            sisa=false
        }
        console.log(data[0].length)
        res.status(200).json({ status: 200, message: "sukses",data:data[0],sisa})
    }

    static async listJadwalBatalMobile(req,res){
        const{halaman}=req.params
        let offset= +halaman * 10
        let offset2 = (+halaman + 1)*10
        let sisa = true
        let jam = +moment().format('hhmmss')
        let tanggal=moment().format ('YYYY-MM-DD')
        
        if(jam>170000){
            tanggal = moment().add(1,'day').format ('YYYY-MM-DD')
        }
        
        let data = await sq.query(`select to2.id as "transaksiOPId",to3."tanggalPengirimanOP" as "tanggalPengirimanBaru",to2.*,o2.* from "transaksiOP" to2 join "OP" o ON o.id = to2."OPId" join "masterCustomer" mc on o."masterCustomerId" = mc.id join "OP" o2 on o2.id = to2."OPId" left join "transaksiOP" to3 on to3.id = to2."rescheduleId"  where to2."tanggalPengirimanOP" >= '${tanggal}' and o."masterUserId" = '${req.dataUsers.id}' and to2."pembatalanTransaksiOP" notnull and o."deletedAt" isnull and to2."deletedAt" isnull order by to2."tanggalPengirimanOP"  limit 10 offset ${offset}`)

        let data2 = await sq.query(`select * from "transaksiOP" to2 join "OP" o ON o.id = to2."OPId" join "masterCustomer" mc on o."masterCustomerId" = mc.id where to2."tanggalPengirimanOP" > '${tanggal}' and o."masterUserId" = '${req.dataUsers.id}' and to2."pembatalanTransaksiOP" notnull and o."deletedAt" isnull and to2."deletedAt" isnull order by to2."tanggalPengirimanOP"  limit 10 offset ${offset2}`)

        if(data2[0].length==0){
            sisa=false
        }
        console.log(data[0].length)
        res.status(200).json({ status: 200, message: "sukses",data:data[0],sisa})
    }

    static async listBarangSalesMobile(req,res){
        const{halaman}=req.params
        let offset= +halaman * 10
        let offset2 = (+halaman + 1)*10
        let sisa = true
        
        let data = await sq.query(`select * from "masterBarang" mb where mb."deletedAt" isnull order by id   limit 10 offset ${offset}`)

        let data2 = await sq.query(`select * from "masterBarang" mb where mb."deletedAt" isnull order by id   limit 10 offset ${offset2}`)

        if(data2[0].length==0){
            sisa=false
        }
        console.log(data[0].length)
        res.status(200).json({ status: 200, message: "sukses",data:data[0],sisa})
    }

    static async listSOBySalesMobile(req,res){
        let {tanggalAwal,tanggalAkhir,customerId}=req.body
        if(!tanggalAwal){
            tanggalAwal=moment().format('YYYY-MM-DD')
        }
        if(!tanggalAkhir){
            tanggalAkhir=moment().format('YYYY-MM-DD')
        }
        let data = await sq.query(`select o.id as "OPId",* from "OP" o join "masterCustomer" mc on o."masterCustomerId" =mc.id where mc.id = '${customerId}' and o."tanggalOrderOP" >= '${tanggalAwal}' and o."tanggalOrderOP" <= '${tanggalAkhir}'and o."deletedAt" isnull and mc."deletedAt" isnull `)
        res.status(200).json({ status: 200, message: "sukses",data:data[0]})
    }

    static async listPiutangPerToko(req, res) {
        let { masterCustomerId } = req.params;

        let data2 = await sq.query(`select o.id as "OPId",o."nomorOP" ,o."tanggalOrderOP" ,o."metodePembayaranOP" ,o."TOPPenjualanOP" ,o."keteranganPenjualanOP" ,o."PPNPenjualanOP" ,o."totalHargaOP" ,o."statusOP" ,o."masterCustomerId" ,o."masterUserId" ,o."createdAt" ,o."updatedAt" ,o."deletedAt" ,mp.id as "masterPiutangId", mp."piutangAwal" ,mp."sisaPiutang" ,mp."TOPPiutang" ,mp."statusPiutang" ,mp."tanggalPiutang" ,mp."OPId" as "IDOp" from "OP" o left join "masterPiutang" mp on mp."OPId" = o.id where o."masterCustomerId" = '${masterCustomerId}' and o."masterUserId" = '${req.dataUsers.id}' and o."deletedAt" isnull and mp."deletedAt" isnull `);

        let dataOP = [];
        let dataMp = [];
        for (let i = 0; i < data2[0].length; i++) {
            dataOP.push({
                OPId: data2[0][i].OPId,
                nomorOP: data2[0][i].nomorOP,
                listPiutang: []
            })
            dataMp.push({
                masterPiutangId: data2[0][i].masterPiutangId,
                piutangAwal: data2[0][i].piutangAwal,
                sisaPiutang: data2[0][i].sisaPiutang,
                TOPPiutang: data2[0][i].TOPPiutang,
                statusPiutang: data2[0][i].statusPiutang,
                tanggalPiutang: data2[0][i].tanggalPiutang,
                idOP: data2[0][i].IDOp
            })
        }

        let check = {};
        let dop = [];
        for (let j = 0; j < dataOP.length; j++) {
            if (!check[dataOP[j].OPId]) {
                check[dataOP[j].OPId] = true;
                dop.push(dataOP[j]);
            }
        }
        
        for (let k = 0; k < dop.length; k++) {
            for (let l = 0; l < dataMp.length; l++) {
                if (dop[k].OPId == dataMp[l].idOP) {
                    dop[k].listPiutang.push({
                        masterPiutangId: dataMp[l].masterPiutangId,
                        piutangAwal: dataMp[l].piutangAwal,
                        sisaPiutang: dataMp[l].sisaPiutang,
                        TOPPiutang: dataMp[l].TOPPiutang,
                        statusPiutang: dataMp[l].statusPiutang,
                        tanggalPiutang: dataMp[l].tanggalPiutang
                    });
                }
            }
        }

        res.status(200).json({ status: 200, message: "sukses", data: dop })
    }
    
}

module.exports=Controller