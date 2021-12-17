const { DataTypes } = require('sequelize');
const sq =  require('../config/connection');

const masterTahapan = sq.define('masterTahapan',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaTahapan:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true
});


module.exports = masterTahapan