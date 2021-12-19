const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const masterKebutuhan = require('../masterKebutuhan/model');
const postLoker = require('../postLoker/model');

const kebutuhanPelamar = sq.define('kebutuhanPelamar', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    statusKebutuhan: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

},
    {
        paranoid: true,
        freezeTableName: true,

    });
kebutuhanPelamar.belongsTo(masterKebutuhan);
masterKebutuhan.hasMany(kebutuhanPelamar)

kebutuhanPelamar.belongsTo(postLoker);
postLoker.hasMany(kebutuhanPelamar)


module.exports = kebutuhanPelamar