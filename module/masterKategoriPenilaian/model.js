const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');

const masterKategoriPenilaian = sq.define('masterKategoriPenilaian', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaKategoriPenilaian: {
        type: DataTypes.STRING,
    }
}, {
    paranoid: true,
    freezeTableName: true
});

module.exports = masterKategoriPenilaian