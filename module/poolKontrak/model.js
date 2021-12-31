const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const dataKaryawan = require('../dataKaryawan/model');

const poolKontrak = sq.define('poolKontrak', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tanggalKontrak: {
        type: DataTypes.DATE,
    },
    totalKontrak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    masaBerlakuKontrak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    jatuhTempoKontrak: {
        type: DataTypes.DATE,
    },
},
    {
        paranoid: true,
        freezeTableName: true,

    });

poolKontrak.belongsTo(dataKaryawan);
dataKaryawan.hasMany(poolKontrak)

module.exports = poolKontrak