const { DataTypes } = require("sequelize");
const sq = require("../config/connection");
const kelurahan = require('../model/kelurahanModel');
const kecamatan = require('../model/kecamatanModel');
const kota = require('../model/kotaModel');
const provinsi = require('../model/provinsiModel');

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
      type: DataTypes.DOUBLE,
    },
    latitude: {
      type: DataTypes.DOUBLE,
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
