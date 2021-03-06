const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const PO = require("../PO/model");

const poCC = sq.define(
  "poCC",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

poCC.belongsTo(PO);
PO.hasMany(poCC);


module.exports = poCC;
