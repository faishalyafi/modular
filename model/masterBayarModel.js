const { DataTypes } = require('sequelize');
const sq = require('../config/connection');
const masterPiutang = require('./masterPiutangModel');
const masterUser = require('./userModel');
const masterBank = require('./bankModel');

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