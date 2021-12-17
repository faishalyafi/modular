const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const masterDivisi = require('../masterDivisi/model');

const masterPosisi = sq.define('masterPosisi', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaPosisi: {
        type: DataTypes.STRING
    },
    kodePosisi: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

masterPosisi.belongsTo(masterDivisi);
masterDivisi.hasMany(masterPosisi);

module.exports = masterPosisi