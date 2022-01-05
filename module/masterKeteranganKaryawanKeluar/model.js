const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');

const masterKeteranganKaryawanKeluar = sq.define('masterKeteranganKaryawanKeluar', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    keteranganKaryawanKeluar: {
        type: DataTypes.STRING,
    }
}, {
    paranoid: true,
    freezeTableName: true
});

module.exports = masterKeteranganKaryawanKeluar