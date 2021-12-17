const supplier = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
  static async register(req, res) {
    const {namaSupplier,nomorTelepon,provinsiId,kotaId, kecamatanId,kelurahanId,fax,email,longitude,latitude} = req.body;
    const id = uuid_v4();
    supplier.findAll({ where: { namaSupplier } }).then((data) => {
      if (data.length) {
        res.status(200).json({ status: 200, message: "Suplier sudah tersedia" });
      } else {
        supplier.create({id,namaSupplier,nomorTelepon,provinsiId, kotumId: kotaId, kecamatanId,kelurahanId,fax,email,longitude,latitude},{returning: true}).then((data) => {
            res.status(200).json({ status: 200, message: "sukses", data });
          }).catch((err) => {
            res.status(500).json({ status: 500, message: "gagal" });
          });
      }
    })
  }
  static update(req, res) {
    const {namaSupplier,nomorTelepon,provinsiId,kotaId, kecamatanId,kelurahanId,fax,email,longitude,latitude,id} = req.body;
    supplier.update({namaSupplier,nomorTelepon,provinsiId, kotumId: kotaId, kecamatanId,kelurahanId,fax,email,longitude,latitude},{where:{id},returning: true}).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1][0] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static delete(req, res) {
    const { id } = req.body;
    supplier.destroy({ where: { id } }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses" });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
  // static list(req, res) {
  //   supplier.findAll().then((data) => {
  //       res.status(200).json({ status: 200, message: "sukses", data });
  //     }).catch((err) => {
  //       res.status(500).json({ status: 500, message: "gagal", data: err });
  //     });
  // }
  static async list (req, res) {
    let data = await sq.query(`
    select ms.id as "masterSupplierId", ms."namaSupplier" ,ms."nomorTelepon" ,ms.fax ,ms.email ,ms.longitude ,ms.latitude ,ms."kelurahanId" ,ms."kecamatanId" ,ms."kotumId" ,ms."provinsiId" ,k."namaKelurahan" ,k2."namaKecamatan" ,k3."namaKota" ,p."namaProvinsi" ,ms."createdAt" ,ms."updatedAt" ,ms."deletedAt" 
    from "masterSupplier" ms 
    join kelurahan k on k.id = ms."kelurahanId" 
    join kecamatan k2 on k2.id = ms."kecamatanId" 
    join kota k3 on k3.id = ms."kotumId" 
    join provinsi p on p.id = ms."provinsiId" 
    where ms."deletedAt" isnull and k."deletedAt" isnull and k2."deletedAt" isnull and k3."deletedAt" isnull and p."deletedAt" isnull `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }
  static detailsById(req, res) {
    const { id } = req.params;
    supplier.findAll({ where: { id } }).then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[0] });
      }).catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }
}
module.exports = Controller;
