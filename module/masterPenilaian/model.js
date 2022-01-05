const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const masterKategoriPenilaian = require('../masterKategoriPenilaian/model');

const masterPenilaian = sq.define('masterPenilaian', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    penilaian: {
        type: DataTypes.STRING,
    }
}, {
    paranoid: true,
    freezeTableName: true
});

masterPenilaian.belongsTo(masterKategoriPenilaian);
masterKategoriPenilaian.hasMany(masterPenilaian);

module.exports = masterPenilaian;