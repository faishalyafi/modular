const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const customer = require("../masterCustomer/model");
const supplier = require("../masterSupplier/model");

const masterBank = sq.define(
  "masterBank",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    namaBank: {
      type: DataTypes.STRING(50),
    },
    nomorRekening: {
      type: DataTypes.STRING(50),
    },
    atasNama: {
      type: DataTypes.STRING(50),
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

masterBank.belongsTo(customer);
customer.hasMany(masterBank);

masterBank.belongsTo(supplier);
supplier.hasMany(masterBank);

module.exports = masterBank;
