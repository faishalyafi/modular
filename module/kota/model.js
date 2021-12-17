const { DataTypes } = require('sequelize');
const sq =  require('../../config/connection');
const provinsi = require('../provinsi/model');

const kota = sq.define('kota',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaKota:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true
});
kota.belongsTo(provinsi);
provinsi.hasMany(kota)


module.exports = kota