const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const customer= require('../../model/customerModel')
const user = require('../user/model')

const absensiSales = sq.define(
  "absensiSales",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    check:{
        type:DataTypes.INTEGER
    },
    fotoAbsensi:{
        type:DataTypes.STRING
    },
    longAbsensi:{
        type:DataTypes.STRING
    },
    latAbsensi:{
        type:DataTypes.STRING
    },
    waktuCheckOut:{
        type:DataTypes.DATE
    },
    longCheckout:{
      type:DataTypes.STRING
    },
    latCheckout:{
      type:DataTypes.STRING
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

absensiSales.belongsTo(customer)
customer.hasMany(absensiSales)

absensiSales.belongsTo(user)
user.hasMany(absensiSales)

module.exports = absensiSales;
