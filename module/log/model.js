const { DataTypes } = require('sequelize');
const sq =  require('../../config/connection');
const user= require('../masterUser/model');

const log = sq.define('log',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    keterangan:{
        type:DataTypes.STRING
    }
    
    
},
{
paranoid:true,
freezeTableName:true
});

log.belongsTo(user)
user.hasMany(log)

module.exports = log