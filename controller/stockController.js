const stock = require("../model/stockModel");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Controller {
    static async listAllstock(req,res){
        let data = await sq.query(`select mb.id as "masterBarangId",mb."namaBarang" ,sum(s."jumlahStock") as "jumlahStock", mb."kodeBarang" from stock s join "masterBarang" mb on mb.id = s."masterBarangId" where s."deletedAt" isnull and mb."deletedAt" is null group by (s."masterBarangId", mb."namaBarang",mb."kodeBarang",mb.id)`);
        res.status(200).json({status:200,message:"sukses",data:data[0]})
    }
    static async listStockByBatchNumber(req,res){
        const{batchNumber}=req.params;
        let data = await sq.query(`select *,(select mb."namaBarang" from "masterBarang" mb where mb.id = s."masterBarangId") from stock s where s."deletedAt" isnull and s."batchNumber" = '${batchNumber}'`);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }
    static async listBarangStockByMbId(req,res){
        const{id}=req.params;
        let data = await sq.query(`select mb.id as stockId,* from stock s 
        join "masterBarang" mb on s."masterBarangId" =mb.id 
        join "masterKategoriBarang" mkb  on mb."masterKategoriBarangId" =mkb.id
        where s."deletedAt"  isnull  and mb."deletedAt"  isnull and mkb."deletedAt" isnull and s."jumlahStock" > 0 and mb.id ='${id}'
        order by s."createdAt" `);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }
    static async listAllBarangGudang(req,res){
        let data = await sq.query(`select s."masterBarangId", mb."namaBarang",s."gudangId" ,g."namaGudang",sum(s."jumlahStock") as "jumlahStock" from stock s join "masterBarang" mb on mb.id = s."masterBarangId" join gudang g on g.id = s."gudangId" where s."deletedAt" isnull and mb."deletedAt" isnull and g."deletedAt" isnull group by mb."namaBarang",g."namaGudang",s."masterBarangId",s."gudangId" order by g."namaGudang"  `);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }
    static async listDetailsBatchBarang(req,res){
        const{gudangId,masterBarangId}=req.params
        console.log(req.params);
        let data = await sq.query(`select g.id as "IdGudang",g."namaGudang" ,mb.id as "idMasterBarang",mb."namaBarang",s."batchNumber",sum(s."jumlahStock") as "jumlahBarangPerBatch" from stock s
        join gudang g on s."gudangId" =g.id
                join "masterBarang" mb on s."masterBarangId" =mb.id
                where mb."deletedAt" isnull and s."deletedAt" isnull 
                and g.id ='${gudangId}' and mb.id='${masterBarangId}'
                group by g.id,g."namaGudang" ,mb.id,mb."namaBarang",s."batchNumber"
                order by mb."namaBarang" `);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }
    static async listSearch(req,res){
        const{namaGudang}=req.params;
        let data = await sq.query(`select mb."namaBarang",g."namaGudang" ,sum(s."jumlahStock") as "jumlahBarangGudang" from stock s 
        join "masterBarang" mb on s."masterBarangId" =mb.id 
        join gudang g on s."gudangId" =g.id 
        where s."deletedAt"  isnull  and mb."deletedAt"  isnull and g."deletedAt" isnull and s."jumlahStock" > 0  and g."namaGudang" ='${namaGudang}'
        group by mb."namaBarang",g."namaGudang",mb."createdAt" 
        order by mb."createdAt" `);
        res.status(200).json({status:200,message:"sukses",data:data[0]});
    }
}

module.exports = Controller;
