const {
	DataTypes
} = require( 'sequelize' );
const sq = require( '../../config/connection' );

const masterKategoriCustomer = sq.define( 'masterKategoriCustomer', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	namaKategori: {
		type: DataTypes.STRING( 50 )
	}
}, {
	paranoid: true,
	freezeTableName: true
} );


module.exports = masterKategoriCustomer