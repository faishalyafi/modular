const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const OP = require('../../model/opModel');

const masterPiutang = sq.define('masterPiutang', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    piutangAwal: {
        type: DataTypes.DOUBLE
    },
    sisaPiutang: {
        type: DataTypes.DOUBLE
    },
    TOPPiutang: {
        type: DataTypes.STRING
    },
    statusPiutang: {
        type: DataTypes.INTEGER
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

masterPiutang.belongsTo(OP);
OP.hasMany(masterPiutang);

module.exports = masterPiutang