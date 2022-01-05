const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');

const masterCuti = sq.define('masterCuti', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaCuti: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });


module.exports = masterCuti