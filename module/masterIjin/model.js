const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');

const masterIjin = sq.define('masterIjin', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaIjin: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });


module.exports = masterIjin