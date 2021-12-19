const { DataTypes } = require('sequelize');
const sq =  require('../../config/connection');

const masterKebutuhan = sq.define('masterKebutuhan',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaKebutuhan:{
        type:DataTypes.STRING
    }

},
{
paranoid:true,
freezeTableName:true
});


module.exports = masterKebutuhan