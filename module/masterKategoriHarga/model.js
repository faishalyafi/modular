const { DataTypes } = require('sequelize');
const sq =  require('../../config/connection');

const masterKategoriHarga = sq.define('masterKategoriHarga',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    kategoriToko:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true
});


module.exports = masterKategoriHarga