const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const kelengkapanLamaran = require('../../model/kelengkapanLamaranModel');

const pengalamanKerja = sq.define('pengalamanKerja', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaPerusahaan: {
        type: DataTypes.STRING
    },
    jabatan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

pengalamanKerja.belongsTo(kelengkapanLamaran);
kelengkapanLamaran.hasMany(pengalamanKerja);

module.exports = pengalamanKerja