const user = require("../model/userModel");
const bcrypt = require("../helper/bcrypt.js");
const jwt = require("../helper/jwt");
const { v4: uuid_v4 } = require("uuid");
const { verifyToken } = require("../helper/jwt");
const sq = require("../config/connection");

class Controller {
  static register(req, res) {
    const { username, password, nama, masterDivisiId, NIP, email } = req.body;
    let encryptedPassword = bcrypt.hashPassword(password);
    user
      .findAll({
        where: {
          username: username,
        },
      })
      .then((data) => {
        if (data.length) {
          res
            .status(200)
            .json({ status: 200, message: "username sudah terdaftar" });
        } else {
          user
            .create(
              {
                id: uuid_v4(),
                username,
                password: encryptedPassword,
                nama,
                masterDivisiId,
                NIP,
                email,
              },
              { returning: true }
            )
            .then((respon) => {
              res
                .status(200)
                .json({ status: 200, message: "sukses", data: respon });
            })
            .catch((err) => {
              res
                .status(500)
                .json({ status: 500, message: "gagal", data: err });
            });
        }
      });
  }

  static login(req, res) {
    const { username, password } = req.body;

    user
      .findAll({
        where: {
          username: username,
        },
      })
      .then((data) => {
        if (data.length) {
          let dataToken = {
            id: data[0].id,
            password: data[0].password,
            masterDivisiId: data[0].masterDivisiId,
          };
          let hasil = bcrypt.compare(password, data[0].dataValues.password);
          if (hasil) {
            res.status(200).json({
              status: 200,
              message: "sukses",
              token: jwt.generateToken(dataToken),
              id: data[0].id,
              masterDivisiId: data[0].masterDivisiId,
            });
          } else {
            res.status(200).json({ status: 200, message: "Password Salah" });
          }
        } else {
          res
            .status(200)
            .json({ status: 200, message: "username Tidak Terdaftar" });
        }
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static loginMobileSales(req, res) {
    const { username, password, UIDSales } = req.body;

    user
      .findAll({
        where: {
          username: username,
        },
      })
      .then((data) => {
        if (data.length) {
          let dataToken = {
            id: data[0].id,
            password: data[0].password,
            masterDivisiId: data[0].masterDivisiId,
          };
          let hasil = bcrypt.compare(password, data[0].dataValues.password);

          if (hasil) {
            if (data[0].masterDivisiId == "0e89044a-0eef-4733-a818-342f7a61b78b") {
              if (!data[0].UIDSales) {
                user
                  .update(
                    { UIDSales },
                    {
                      where: {
                        id: data[0].id,
                      },
                    }
                  )
                  .then((hasil2) => {
                    res
                      .status(200)
                      .json({
                        status: 200,
                        message: "sukses",
                        token: jwt.generateToken(dataToken),
                        id: data[0].id,
                        masterDivisiId: data[0].masterDivisiId,
                      });
                  });
              } else if (data[0].UIDSales !== UIDSales) {
                res.status(200).json({ status: 200, message: "device salah" });
              } else {
                res
                  .status(200)
                  .json({
                    status: 200,
                    message: "sukses",
                    token: jwt.generateToken(dataToken),
                    id: data[0].id,
                    masterDivisiId: data[0].masterDivisiId,
                  });
              }
            } else {
              res
                .status(200)
                .json({
                  status: 200,
                  message: "sukses",
                  token: jwt.generateToken(dataToken),
                  id: data[0].id,
                  masterDivisiId: data[0].masterDivisiId,
                });
            }
          } else {
            res.status(200).json({ status: 200, message: "Password Salah" });
          }
        } else {
          res
            .status(200)
            .json({ status: 200, message: "username Tidak Terdaftar" });
        }
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static profil(req, res) {
    user
      .findAll({
        where: {
          id: req.dataUsers.id,
        },
      })
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data: data });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static async update(req, res) {
    const { nama, masterDivisiId, NIP,email} = req.body;
    if(req.files){
      if(req.files.file1){
          await sq.query(`update "masterUser" SET "fotoUser" ='${req.files.file1[0].filename}' where id = '${req.dataUsers.id}'`)
      }
    }

    user
      .update(
        { nama, masterDivisiId, NIP, email },
        {
          where: {
            id: req.dataUsers.id,
          },
        }
      )
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses" });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static delete(req, res) {
    const { id } = req.body;
    user
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses" });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static ALL(req, res) {
    user
      .findAll({})
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static listByMasterDivisiId(req, res) {
    const { masterDivisiId } = req.params;
    console.log(req.params);
    user
      .findAll({
        where: {
          masterDivisiId: masterDivisiId,
        },
      })
      .then((data) => {
        res.status(200).json({ status: 200, message: "sukses", data });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, message: "gagal", data: err });
      });
  }

  static async checkAuthentification(req, res) {
    try {
      var decode = verifyToken(req.headers.token);
      user
        .findAll({
          where: {
            id: decode.id,
            password: decode.password,
          },
        })
        .then((data) => {
          if (data.length > 0) {
            req.dataUsers = decode;
            res.status(200).json({ status: 200, message: "sukses" });
          } else {
            res.status(200).json({ status: 200, message: "anda belum login" });
          }
        });
    } catch (err) {
      res.status(200).json({ status: 200, message: "anda belum login" });
    }
  }

  static async listUserByDivisiKode(req,res){
    const {kodeDivisi}=req.params;
    let data =  await sq.query(`select md.id as "masterDivisiId",* from "masterDivisi" md join "masterUser" mu on mu."masterDivisiId" = md.id where md."deletedAt" isnull and mu."deletedAt" isnull and md."kodeDivisi" = '${kodeDivisi}'`);
    res.status(200).json({status:200,message:"sukses",data:data[0]})
  }
}

module.exports = Controller;
