const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const masterPosisi = require('../masterPosisi/model');

const loker = sq.define('loker', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaLoker: {
        type: DataTypes.STRING
    },
    keteranganLoker: {
        type: DataTypes.TEXT
    },
    tanggalAkhirLoker: {
        type: DataTypes.DATE
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

loker.belongsTo(masterPosisi);
masterPosisi.hasMany(loker);

module.exports = loker