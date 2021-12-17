const { DataTypes } = require('sequelize');
const sq =  require('../config/connection');
const kota = require('./kotaModel');

const kecamatan = sq.define('kecamatan',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaKecamatan:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true
});
kecamatan.belongsTo(kota);
kota.hasMany(kecamatan)


module.exports = kecamatan