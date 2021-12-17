const {DataTypes} = require( 'sequelize' );
const sq = require( '../../config/connection' );
const masterBarang =  require("../masterBarang/model")
const formula =  require("../formula/model")

const subFormula = sq.define( 'subFormula', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	jumlahBarangFormula: {
		type: DataTypes.DOUBLE,
	}
}, {
	paranoid: true,
	freezeTableName: true
} );

subFormula.belongsTo(masterBarang);
masterBarang.hasMany(subFormula);

subFormula.belongsTo(formula);
formula.hasMany(subFormula);


module.exports = subFormula;