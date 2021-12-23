const unit = require("./model");
const { v4: uuid_v4 } = require("uuid");

class Unit {
  static register(req, res) {
    const { satuan, jumlahIsi } = req.body;
    unit
      .findAll({
        where: {
          satuan: satuan,
        },
      })
      .then((data) => {
        if (data.length) {
          res.status(200).json({
            status: 200,
            message: "data sudah ada",
          });
        } else {
          unit
            .create({
              id: uuid_v4(),
              satuan: satuan,
              jumlahIsi: jumlahIsi,
            })
            .then((data) => {
              res.status(200).json({
                status: 200,
                message: "sukses",
              });
            });
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
    unit
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
    unit
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
    const { id, satuan, jumlahIsi } = req.body;
    unit
      .update(
        {satuan, jumlahIsi},
        {
          where: {id}
        }
      )
      .then((data2) => {
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
    unit
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

module.exports = Unit;
