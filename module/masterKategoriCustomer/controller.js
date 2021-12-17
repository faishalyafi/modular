const customerCategory = require( './model' );
const {v4: uuid_v4} = require( 'uuid' );
const sq = require("../../config/connection");

class CustomerCategory {
	static register( req, res ) {
		const { namaKategori } = req.body;
		customerCategory.findAll( {
				where: {
					namaKategori: namaKategori
				}
			} )
			.then( data => {
				if ( data.length ) {
					res.status( 200 ).json( {status: 200,message: "data sudah ada"} );
				} else {
					customerCategory.create( {
							id: uuid_v4(),
							namaKategori: namaKategori
						} )
						.then( data => {
							res.status( 200 ).json( {status: 200,message: "sukses"} );
						} )
				}
			} )
			.catch( err => {
				res.status( 500 ).json( {
					status: 500,
					message: "gagal",
					data: err
				} )
			} )
	}

	static list( req, res ) {
		customerCategory.findAll()
			.then( data => {
				res.status( 200 ).json( {
					status: 200,
					message: "sukses",
					data: data
				} );
			} )
			.catch( err => {
				res.status( 500 ).json( {
					status: 500,
					message: "gagal",
					data: err
				} )
			} )
	}

	static async listByMasterCustomerCategoryId(req,res) {
		const {id} = req.params;
		let data = await sq.query(`
			select * from "masterCustomer" mc 
			join "masterKategoriCustomer" mkc on mc."masterKategoriCustomerId"  = mkc.id 
			where mc."deletedAt" isnull 
			and mkc."deletedAt" isnull 
			and mkc.id ='${id}';`)
		res.status(200).json({ status: 200, message: "sukses", data:data[0] });
	}

	static detailsById( req, res ) {
		const {id} = req.params;
		customerCategory.findAll( {
				where: {
					id: id
				}
			} )
			.then( data => {
				res.status( 200 ).json( {
					status: 200,
					message: "sukses",
					data: data
				} );
			} )
			.catch( err => {
				res.status( 500 ).json( {
					status: 500,
					message: "gagal",
					data: err
				} )
			} )
	}

	static update( req, res ) {
		const {id,namaKategori} = req.body;
			customerCategory.update( {
				namaKategori: namaKategori
			}, {
				where: {
					id: id
				}
			} )
			.then( data => {
				res.status( 200 ).json( {
					status: 200,
					message: "sukses"
				} )
			} )
			.catch( err => {
				res.status( 500 ).json( {
					status: 500,
					message: "gagal",
					data: err
				} )
			} )
	}

	static delete( req, res ) {
		const {id} = req.body
		customerCategory.destroy( {
				where: {
					id: id
				}
			} )
			.then( data => {
				res.status( 200 ).json( {
					status: 200,
					message: "sukses"
				} )
			} )
			.catch( err => {
				res.status( 500 ).json( {
					status: 500,
					message: "gagal",
					data: err
				} )
			} )
	}
}

module.exports = CustomerCategory;