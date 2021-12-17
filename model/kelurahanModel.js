const { DataTypes } = require('sequelize');
const sq =  require('../config/connection');
const kecamatan = require('./kecamatanModel');

const kelurahan = sq.define('kelurahan',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaKelurahan:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true,

});
kelurahan.belongsTo(kecamatan);
kecamatan.hasMany(kelurahan)


module.exports = kelurahan