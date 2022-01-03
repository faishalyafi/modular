const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const posisi = require('../masterPosisi/model');
const divisi = require('../masterDivisi/model');
const masterShift = require('../masterShift/model');

const dataKaryawan = sq.define('dataKaryawan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaKaryawan: {
        type: DataTypes.STRING
    },
    nomorKTPKaryawan: {
        type: DataTypes.STRING
    },
    tinggiBadanKaryawan: {
        type: DataTypes.DOUBLE
    },
    beratBadanKaryawan: {
        type: DataTypes.DOUBLE
    },
    agamaKaryawan: {
        type: DataTypes.STRING
    },
    kebangsaanKaryawan: {
        type: DataTypes.STRING
    },
    jenisKelaminKaryawan: {
        type: DataTypes.STRING
    },
    statusKaryawan: {
        type: DataTypes.STRING
    },
    tempatLahirKaryawan: {
        type: DataTypes.STRING
    },
    tanggalLahirKaryawan: {
        type: DataTypes.DATE
    },
    noHpKaryawan: {
        type: DataTypes.STRING
    },
    emailKaryawan: {
        type: DataTypes.STRING
    },
    alamatKaryawan: {
        type: DataTypes.STRING
    },
    tanggalMulaiKerja: {
        type: DataTypes.DATE
    },
    statusKerjaKaryawan: {
        type: DataTypes.INTEGER  //0:Kontrak || 1:Permanen
    },
    lamaKontrakKaryawan: {
        type: DataTypes.INTEGER
    },
    namaIstriKaryawan: {
        type: DataTypes.STRING
    },
    KTPIstriKaryawan: {
        type: DataTypes.STRING
    },
    alamatIstriKaryawan: {
        type: DataTypes.STRING
    },
    jumlahAnakKaryawan: {
        type: DataTypes.INTEGER
    },
    namaAnak1Karyawan: {
        type: DataTypes.STRING
    },
    namaAnak2Karyawan: {
        type: DataTypes.STRING
    },
    fotoProfilKaryawan: {
        type: DataTypes.STRING
    },
    fotoKKKaryawan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });


dataKaryawan.belongsTo(posisi);
posisi.hasMany(dataKaryawan);

dataKaryawan.belongsTo(divisi);
divisi.hasMany(dataKaryawan);

dataKaryawan.belongsTo(masterShift);
masterShift.hasMany(dataKaryawan);

module.exports = dataKaryawan