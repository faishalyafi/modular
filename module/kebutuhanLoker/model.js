const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const masterKebutuhan = require('../masterKebutuhan/model');
const loker = require('../loker/model');

const kebutuhanLoker = sq.define('kebutuhanLoker', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    }

},
    {
        paranoid: true,
        freezeTableName: true,

    });
kebutuhanLoker.belongsTo(masterKebutuhan);
masterKebutuhan.hasMany(kebutuhanLoker)

kebutuhanLoker.belongsTo(loker);
loker.hasMany(kebutuhanLoker)


module.exports = kebutuhanLoker