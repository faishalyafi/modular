const { DataTypes } = require( 'sequelize' );
const sq = require( '../../config/connection' );

const masterUnit = sq.define( 'masterUnit', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	satuan: {
		type: DataTypes.STRING( 50 )
	},
	jumlahIsi: {
		type: DataTypes.DOUBLE,
		defaultValue: 0
	}
}, {
	paranoid: true,
	freezeTableName: true
} );


module.exports = masterUnit