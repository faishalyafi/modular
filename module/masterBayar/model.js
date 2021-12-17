const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const masterPiutang = require('../masterPiutang/model');
const masterUser = require('../masterUser/model');
const masterBank = require('../masterBank/model');

const masterBayar = sq.define('masterBayar', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    jumlahBayar: {
        type: DataTypes.DOUBLE
    },
    tanggalBayar: {
        type: DataTypes.DATE
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

masterBayar.belongsTo(masterPiutang);
masterPiutang.hasMany(masterBayar);

masterBayar.belongsTo(masterUser);
masterUser.hasMany(masterBayar);

masterBayar.belongsTo(masterBank);
masterBank.hasMany(masterBayar);

module.exports = masterBayar