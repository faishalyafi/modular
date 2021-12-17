const bankModel = require("./model");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../../config/connection");

class Controller {
  static register(req, res) {
    const {
      masterCustomerId,
      masterSupplierId,
      namaBank,
      nomorRekening,
      atasNama,
    } = req.body;
    bankModel
      .findAll({ where: { nomorRekening: nomorRekening } })
      .then((data) => {
        if (data.length) {
          res.status(200).json({ status: 200, message: "data sudah ada" });
        } else {
          bankModel
            .create({
              id: uuid_v4(),
              namaBank,
              nomorRekening,
              atasNama,
              masterCustomerId,
              masterSupplierId,
            })
            .then((data) => {
              res.status(200).json({ status: 200, message: "sukses" });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static async listByMasterCustomerId(req, res) {
    const { masterCustomerId } = req.params;
    let data = await sq.query(`
      select mb.id as "masterBankId", * from "masterBank" mb 
      join "masterCustomer" mc on mb."masterCustomerId" = mc.id 
      where mb."deletedAt" isnull 
      and mc."deletedAt" isnull 
      and mc.id='${masterCustomerId}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listByMasterSupplierId(req, res) {
    const { masterSupplierId } = req.params;
    let data =
      await sq.query(`select mb.id as "masterBankId",* from "masterBank" mb join "masterSupplier" ms on mb."masterSupplierId" = ms.id 
    where mb."deletedAt" isnull and ms."deletedAt" isnull and ms.id = '${masterSupplierId}'`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static list(req, res) {
    bankModel
      .findAll()
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static detailsById(req, res) {
    const { id } = req.params;
    bankModel
      .findAll({ where: { id: id } })
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static update(req, res) {
    const {
      id,
      masterCustomerId,
      masterSupplierId,
      namaBank,
      nomorRekening,
      atasNama,
    } = req.body;
    bankModel
      .update(
        {
          namaBank,
          nomorRekening,
          atasNama,
          masterCustomerId,
          masterSupplierId,
        },
        { where: { id }, returning: true }
      )
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data[1] });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static delete(req, res) {
    const { id } = req.body;
    bankModel
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }
  static bulk(req, res) {
    const { bulk } = req.body;
    for (let i = 0; i < bulk.length; i++) {
      const id = uuid_v4();
      bulk[i].id = id;
      // console.log(bulk[i]);
    }
    bankModel
      .bulkCreate(bulk)
      .then((data) => {
        res.status(200).json({
          status: 200,
          message: "sukses",
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }
}

module.exports = Controller;
