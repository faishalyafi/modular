const { DataTypes } = require('sequelize');
const sq = require('../config/connection');
const kelengkapanLamaran = require('./kelengkapanLamaranModel');

const riwayatPendidikan = sq.define('riwayatPendidikan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tingkatPendidikan: {
        type: DataTypes.STRING
    },
    tahunLulus: {
        type: DataTypes.INTEGER
    },
    namaSekolah: {
        type: DataTypes.STRING
    },
    jurusan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

riwayatPendidikan.belongsTo(kelengkapanLamaran);
kelengkapanLamaran.hasMany(riwayatPendidikan);

module.exports = riwayatPendidikan