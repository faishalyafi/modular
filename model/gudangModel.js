const {DataTypes} = require( 'sequelize' );
const sq = require( '../config/connection' );

const gudang = sq.define( 'gudang', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	kodeGudang: {
		type: DataTypes.STRING,
	},
	namaGudang: {
		type: DataTypes.STRING,
	}
}, {
	paranoid: true,
	freezeTableName: true
} );


module.exports = gudang;