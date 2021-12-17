const { DataTypes } = require('sequelize');
const sq =  require('../config/connection');
const divisi = require('./masterDivisiModel')

const user = sq.define('masterUser',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama:{
        type:DataTypes.STRING(50)
    },
    NIP:{
        type:DataTypes.STRING
    },
    username:{
        type:DataTypes.STRING(50)
    },
    password:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    UIDSales:{
        type:DataTypes.STRING
    },
    fotoUser:{
        type:DataTypes.STRING
    }
    
    
},
{
paranoid:true,
freezeTableName:true
});

user.belongsTo(divisi)
divisi.hasMany(user)


module.exports = user