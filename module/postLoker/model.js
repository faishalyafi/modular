const { DataTypes } = require('sequelize');
const sq = require('../../config/connection');
const loker = require('../loker/model');

const postLoker = sq.define('postLoker', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namaPengirim: {
        type: DataTypes.STRING
    },
    emailPengirim: {
        type: DataTypes.STRING
    },
    alamatPengirim: {
        type: DataTypes.STRING
    },
    CV: {
        type: DataTypes.STRING
    },
    statusPostLoker: {
        type: DataTypes.INTEGER  // 0: dibuat || 1: Acc || 2: Lengkap Lanjut || 3: Lengkap di Tolak
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

postLoker.belongsTo(loker);
loker.hasMany(postLoker);

module.exports = postLoker