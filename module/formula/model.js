const {DataTypes} = require( 'sequelize' );
const sq = require( '../../config/connection' );
const masterBarang =  require("../masterBarang/model")

const formula = sq.define( 'formula', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	keteranganFormula: {
		type: DataTypes.STRING,
	},
	ketahananBarang: {
		type: DataTypes.INTEGER,
	},
	isActive:{
		type: DataTypes.INTEGER,
		defaultValue:1
	}
}, {
	paranoid: true,
	freezeTableName: true
} );

formula.belongsTo(masterBarang);
masterBarang.hasMany(formula)


module.exports = formula;