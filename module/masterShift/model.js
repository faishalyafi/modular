const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');

const masterShift = sq.define('masterShift', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    jamAwal: {
        type: DataTypes.TIME
    },
    jamAkhir: {
        type: DataTypes.TIME
    },
    namaShift: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });


module.exports = masterShift