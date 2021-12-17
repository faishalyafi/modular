const { DataTypes } = require('sequelize');
const sq =  require('../../config/connection');
const masterTahapan = require('../../model/masterTahapanModel');
const postLoker=require('../../model/postLokerModel')

const poolTahapan = sq.define('poolTahapan',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nilaiPoolTahapan:{
        type:DataTypes.DOUBLE,
        defaultValue:0
    },
    keteranganPoolTahapan:{
        type:DataTypes.STRING
    },
    tanggalPemanggilan:{
        type:DataTypes.DATE
    },
    statusTahapan:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true,

});
poolTahapan.belongsTo(masterTahapan);
masterTahapan.hasMany(poolTahapan)

poolTahapan.belongsTo(postLoker);
postLoker.hasMany(poolTahapan)


module.exports = poolTahapan