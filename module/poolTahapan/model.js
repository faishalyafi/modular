const { DataTypes } = require('sequelize');
const sq =  require('../../config/connection');
const masterTahapan = require('../masterTahapan/model');
const postLoker=require('../postLoker/model')

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
    jamPemanggilan:{
        type: DataTypes.TIME
    },
    statusTahapan:{
        type:DataTypes.STRING,
        defaultValue:0
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