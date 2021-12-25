const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const kelurahan = require('../kelurahan/model');
const kecamatan = require('../kecamatan/model');
const kota = require('../kota/model');
const provinsi = require('../provinsi/model');

const supplier = sq.define(
  "masterSupplier",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    namaSupplier: {
      type: DataTypes.STRING,
    },
    nomorTelepon: {
      type: DataTypes.STRING,
    },
    fax: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

supplier.belongsTo(kelurahan);
kelurahan.hasMany(supplier);

supplier.belongsTo(kecamatan);
kecamatan.hasMany(supplier);

supplier.belongsTo(kota);
kota.hasMany(supplier);

supplier.belongsTo(provinsi);
provinsi.hasMany(supplier);

module.exports = supplier;
