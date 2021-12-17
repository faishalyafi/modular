const pic = require("../model/picModel");
const { v4: uuid_v4 } = require("uuid");
const sq = require("../config/connection");

class Pic {
  static register(req, res) {
    const { masterCustomerId, nomorIdentitas,jenisIdentitas, nama,nomorTelepon,jabatan,email, masterSupplierId } = req.body;
    pic
      .findAll({
        where: {
          nomorTelepon: nomorTelepon,
        },
      })
      .then((data) => {
        if (data.length) {
          res.status(200).json({
            status: 200,
            message: "data sudah ada",
          });
        } else {
          pic
            .create({
              id: uuid_v4(),
              masterCustomerId,
              nomorIdentitas,
              jenisIdentitas,
              nama,
              nomorTelepon,
              jabatan,
              email,
              masterSupplierId,
            })
            .then((data) => {
              res.status(200).json({
                status: 200,
                message: "sukses",
              });
            })
        }
      })
      .catch((err) => {
        res.status(500).json({
          status: 500,
          message: "gagal",
          data: err,
        });
      });
  }

  static list(req, res) {
    pic
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

  static async listByMasterSupplierId(req, res) {
    const { masterSupplierId } = req.params;
    console.log(req.params);
    let data = await sq.query(`
      select mp.id as "masterPicId" , * from "masterPic" mp 
      join "masterSupplier" ms ON mp."masterSupplierId" = ms.id 
      where mp."deletedAt" isnull 
      and ms."deletedAt" isnull 
      and ms.id = '${masterSupplierId}' `);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static async listByMasterCustomerId(req, res) {
    const { masterCustomerId } = req.params;
    let data = await sq.query(`
			select mp.* from "masterPic" mp 
			join "masterCustomer" mc on mp."masterCustomerId" =mc.id 
			where mp."deletedAt" isnull 
			and mc."deletedAt" isnull 
			and mc.id ='${masterCustomerId}';`);
    res.status(200).json({ status: 200, message: "sukses", data: data[0] });
  }

  static detailsById(req, res) {
    const { id } = req.params;
    pic
      .findAll({
        where: {
          id: id,
        },
      })
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
      nomorIdentitas,
      jenisIdentitas,
      nama,
      nomorTelepon,
      jabatan,
      email,
      masterSupplierId,
    } = req.body;
    pic
      .update(
        {
          masterCustomerId,
          nomorIdentitas,
          jenisIdentitas,
          nama,
          nomorTelepon,
          jabatan,
          email,
          masterSupplierId,
        },
        {
          where: {
            id: id,
          },
        }
      )
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

  static delete(req, res) {
    const { id } = req.body;
    pic
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
}

module.exports = Pic;
