const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const postLoker = require('../postLoker/model');

const kelengkapanLamaran = sq.define('kelengkapanLamaran', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaPelamar: {
        type: DataTypes.STRING
    },
    nomorKTPPelamar: {
        type: DataTypes.STRING
    },
    posisiLamaran: {
        type: DataTypes.STRING
    },
    tinggiBadanPelamar: {
        type: DataTypes.INTEGER
    },
    beratBadanPelamar: {
        type: DataTypes.INTEGER
    },
    agamaPelamar: {
        type: DataTypes.STRING
    },
    kebangsaanPelamar: {
        type: DataTypes.STRING
    },
    jenisKelaminPelamar: {
        type: DataTypes.STRING
    },
    statusPelamar: {
        type: DataTypes.STRING
    },
    tempatLahirPelamar: {
        type: DataTypes.STRING
    },
    tanggalLahirPelamar: {
        type: DataTypes.DATE
    },
    noHpPelamar: {
        type: DataTypes.INTEGER
    },
    emailPelamar: {
        type: DataTypes.STRING
    },
    alamatPelamar: {
        type: DataTypes.STRING
    },
    tanggalMasukLamaran: {
        type: DataTypes.DATE
    },
    daftarRiwayatHidup: {
        type: DataTypes.STRING
    },
    pasFoto4x6: {
        type: DataTypes.INTEGER
    },
    pasFoto3x4: {
        type: DataTypes.INTEGER
    },
    fotoCopyKTP: {
        type: DataTypes.INTEGER
    },
    fotoCopyKK: {
        type: DataTypes.INTEGER
    },
    fotoCopyIjazah: {
        type: DataTypes.INTEGER
    },
    fotoCopySuratSehat: {
        type: DataTypes.INTEGER
    },
    fotoCopySKCK: {
        type: DataTypes.INTEGER
    },
    kartuJKK: {
        type: DataTypes.INTEGER
    },
    statusKelengkapan: {
        type: DataTypes.INTEGER, // 0.default,1.verifikasi,2.ditolak,3.lengkap
    }                  
},
    {
        paranoid: true,
        freezeTableName: true
    });

kelengkapanLamaran.belongsTo(postLoker);
postLoker.hasMany(kelengkapanLamaran);

module.exports = kelengkapanLamaran