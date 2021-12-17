const { DataTypes } = require('sequelize');
const sq = require('../config/connection');
const loker = require('../model/lokerModel');

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
        type: DataTypes.INTEGER
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

postLoker.belongsTo(loker);
loker.hasMany(postLoker);

module.exports = postLoker