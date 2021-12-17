const { DataTypes } = require( 'sequelize' );
const sq = require( '../config/connection' );
const masterCustomerCategory = require( '../model/customerCategoryModel');
const user = require('../model/userModel')
const masterKategoriHarga = require('../model/masterKategoriHargaModel');
const kelurahan = require('../model/kelurahanModel');
const kecamatan = require('../model/kecamatanModel');
const kota = require('../model/kotaModel');
const provinsi = require('../model/provinsiModel');

const masterCustomer = sq.define( 'masterCustomer', {
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	namaCustomer: {
		type: DataTypes.STRING
	},
	alamatLengkap: {
		type: DataTypes.TEXT
	},
	kodePos: {
		type: DataTypes.DOUBLE
	},
	nomorTelepon: {
		type: DataTypes.STRING
	},
	email: {
		type: DataTypes.STRING
	},
	longitude: {
		type: DataTypes.STRING,
	},
	latitude: {
		type: DataTypes.STRING,
	},
	fax: {
		type: DataTypes.STRING
	},
	TOPCustomer: {
		type: DataTypes.STRING
	},
	statusSurvey:{
		type: DataTypes.INTEGER,
		defaultValue:0  // 0:tidak deal, 1: deal tp belum diajukan(belum aktif), 2: sudah di acc, 3: ditolah/tidak aktif 
	},
	fotoCustomer:{
		type:DataTypes.STRING
	}
}, {
	paranoid: true,
	freezeTableName: true
} );

masterCustomer.belongsTo( masterCustomerCategory );
masterCustomerCategory.hasMany( masterCustomer );

masterCustomer.belongsTo(user);
user.hasMany(masterCustomer);

masterCustomer.belongsTo(masterKategoriHarga);
masterKategoriHarga.hasMany(masterCustomer);

masterCustomer.belongsTo(kelurahan);
kelurahan.hasMany(masterCustomer);

masterCustomer.belongsTo(kecamatan);
kecamatan.hasMany(masterCustomer);

masterCustomer.belongsTo(kota);
kota.hasMany(masterCustomer);

masterCustomer.belongsTo(provinsi);
provinsi.hasMany(masterCustomer);

module.exports = masterCustomer