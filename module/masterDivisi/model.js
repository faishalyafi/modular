const { DataTypes } = require('sequelize');
const sq =  require('../../config/connection');

const masterDivisi = sq.define('masterDivisi',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaDivisi:{
        type:DataTypes.STRING
    },
    kodeDivisi:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true
});


module.exports = masterDivisi