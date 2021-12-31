const customer = require('./model');
const poolHargaJualModel = require('../poolHargaJual/model');
const { v4: uuid_v4 } = require('uuid');
const sq = require("../../config/connection");

class Customer {
	static register(req, res) {
		let { namaCustomer, alamatLengkap, masterKategoriCustomerId, kodePos, nomorTelepon, email, longitude, latitude, provinsiId, kotaId, kecamatanId, kelurahanId, fax, masterUserId, masterKategoriHargaId, statusSurvey} = req.body;
		let f1 = ""
		if (!masterUserId) {
			masterUserId = req.dataUsers.id;
		}
		if (req.files) {
			if (req.files.file1[0]) {
				f1 = req.files.file1[0].filename
			}
		}
		console.log(req.body);
		customer.create({ id: uuid_v4(), namaCustomer, alamatLengkap, masterKategoriCustomerId, kodePos, nomorTelepon, email, longitude, latitude, provinsiId, kotumId: kotaId, kecamatanId,kelurahanId, fax, masterUserId, masterKategoriHargaId, fotoCustomer: f1, statusSurvey })
			.then((data) => {
				res.status(200).json({ status: 200, message: "sukses", data: data });
			})
			.catch((err) => {
				res.status(500).json({ status: 500, message: "gagal", data: err });
			});
	}

	static async list(req, res) {
		let data = await sq.query(`
		select mc.id as "masterCustomerId" ,* 
		from "masterCustomer" mc 
		join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId" 
		join "masterUser" mu on mu.id = mc."masterUserId" 
		join kelurahan k on k.id = mc."kelurahanId" 
		join kecamatan k2 on k2.id = mc."kecamatanId" 
		join kota k3 on k3.id = mc."kotumId" 
		join provinsi p on p.id = mc."provinsiId" 
		where mc."deletedAt" isnull and mkc."deletedAt" isnull and mu."deletedAt" isnull 
		and k."deletedAt" isnull and k2."deletedAt" isnull and k3."deletedAt" isnull and p."deletedAt" isnull `);
		res.status(200).json({ status: 200, message: "sukses", data: data[0] });
	}

	static async listLaporanCustomer(req, res) {
		// const {val}= req.body;
		// let hasil = `and mc."namaCustomer" ilike '${val}%'`
		// if(!val){
		// 	hasil="";
		// }
		let data = await sq.query(`select mc.id as "masterCustomerId", mc."namaCustomer" ,mp.nama as "namaPIC" ,mkc."namaKategori" as "namaKategoriCustomer" ,mp."nomorIdentitas" ,mp."nomorTelepon" ,mb."namaBank" ,mb."nomorRekening" from "masterCustomer" mc join "masterPic" mp on mp."masterCustomerId" = mc.id join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId" join "masterBank" mb on mb."masterCustomerId" = mc.id where mc."deletedAt" isnull and mp."deletedAt" isnull and mkc."deletedAt" isnull and mb."deletedAt" isnull  order by mc."createdAt" `);

		res.status(200).json({ status: 200, message: "sukses", data: data[0] });
	}
	// static async detailsLaporanCustomer(req,res){
	// 	let data = await sq.query(`select mc.id as "masterCustomerId", mc."namaCustomer" ,mp.nama as "namaPIC" ,mkc."namaKategori" as "namaKategoriCustomer" ,mp."nomorIdentitas" ,mp."nomorTelepon" ,mb."namaBank" ,mb."nomorRekening" from "masterCustomer" mc 
	// 	join "masterPic" mp on mp."masterCustomerId" = mc.id 
	// 	join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId" 
	// 	join "masterBank" mb on mb."masterCustomerId" = mc.id 
	// 	where mc."deletedAt" isnull and mp."deletedAt" isnull and mkc."deletedAt" isnull and mb."deletedAt" isnull order by mc."createdAt" `);

	// 	res.status(200).json({status:200,message:"sukses",data:data[0]});
	// }

	static async listByStatus(req, res) {
		const { statusSurvey } = req.params;
		let data = await sq.query(`select mc.id as "masterCustomerId" ,* from "masterCustomer" mc join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId" join "masterUser" mu on mu.id = mc."masterUserId" where mc."deletedAt" isnull and mkc."deletedAt" isnull and mu."deletedAt" isnull and mc."statusSurvey" = ${statusSurvey}`);
		res.status(200).json({ status: 200, message: "sukses", data: data[0] });
	}

	static async detailsById(req, res) {
		const { id } = req.params;
		// let data = await sq.query(`
		// 	select mc.id as "masterCustomerId" ,* from "masterCustomer" mc 
		// 	join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId" 
		// 	where mc."deletedAt" isnull 
		// 	and mkc."deletedAt" isnull 
		// 	and mc.id ='${id}'`);
		// let data = await sq.query(`select mc.id as "masterCustomerId" ,* from "masterCustomer" mc join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId" join "masterUser" mu ON mc."masterUserId" = mu.id where mc."deletedAt" isnull and mkc."deletedAt" isnull and mu."deletedAt" isnull and mc.id ='${id}'`);
		let data = await sq.query(`select mc.id as "masterCustomerId", mc."createdAt" as "mcCreatedAt",* from "masterCustomer" mc join "masterKategoriCustomer" mkc on mkc.id = mc."masterKategoriCustomerId" join "masterUser" mu ON mc."masterUserId" = mu.id where mc."deletedAt" isnull and mkc."deletedAt" isnull and mu."deletedAt" isnull and mc.id ='${id}'`);
		res.status(200).json({ status: 200, message: "sukses", data: data[0] });
	}

	static async update(req, res) {
		let { id, namaCustomer, alamatLengkap, masterKategoriCustomerId, kodePos, nomorTelepon, email, longitude, latitude, provinsiId, kotaId, kecamatanId, kelurahanId, fax, masterUserId, masterKategoriHargaId, statusSurvey } = req.body;
		// console.log(req.body);
		if (!masterUserId) {
			masterUserId = req.dataUsers.id;
		}
		if (req.files) {
			if (req.files.file1) {
				await sq.query(`update users SET "fotoCustomer" ='${req.files.file1[0].filename}' where id = ${id}`)
			}
		}
		customer.update({ namaCustomer, alamatLengkap, masterKategoriCustomerId, kodePos, nomorTelepon, email, longitude, latitude, provinsiId, kotumId: kotaId, kecamatanId,kelurahanId, fax, masterUserId, statusSurvey, masterKategoriHargaId }, { where: { id: id } })
			.then((data) => {
				res.status(200).json({ status: 200, message: "sukses" })
			})
			.catch((err) => {
				res.status(500).json({ status: 500, message: "gagal", data: err })
			});
	}

	static delete(req, res) {
		const { id } = req.body
		customer.destroy({ where: { id: id } }).then((data) => {
			res.status(200).json({ status: 200, message: "sukses" })
		}).catch((err) => {
			res.status(500).json({ status: 500, message: "gagal", data: err })
		});
	}

	static poolHargaJual(req, res) {
		const { bulkHargaJual } = req.body;
		for (let i = 0; i < bulkHargaJual.length; i++) {
			bulkHargaJual[i].id = bulkHargaJual[i].masterBarangId + "-" + bulkHargaJual[i].masterKategoriHargaId;
		}
		poolHargaJualModel.bulkCreate(bulkHargaJual, {
			updateOnDuplicate: ["hargaJual"],
		})
			.then((data) => {
				res.status(200).json({ status: 200, message: "sukses" })
			})
			.catch((err) => {
				res.status(500).json({ status: 500, message: "gagal", data: err })
			});
	}
}

module.exports = Customer;