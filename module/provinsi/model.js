const { DataTypes } = require('sequelize');
const sq =  require('../../config/connection');

const provinsi = sq.define('provinsi',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaProvinsi:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true
});


module.exports = provinsi