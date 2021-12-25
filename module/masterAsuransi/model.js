const { DataTypes } = require( 'sequelize' );
const sq = require( '../../config/connection' );

const masterAsuransi = sq.define( 'masterAsuransi', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	namaAsuransi: {
		type: DataTypes.STRING,
	}
}, {
	paranoid: true,
	freezeTableName: true
} );


module.exports = masterAsuransi