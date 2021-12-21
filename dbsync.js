const koneksi = require('./config/connection');


let normalizedPath = require("path").join(__dirname, "./model");
require("fs").readdirSync(normalizedPath).forEach(function(file) {

require("./model/" + file);

});


koneksi.sync({ alter: true }).then(() => {
    console.log('Database Berhasil di Sinkronisasi')
    console.log('disconnecting...')
  }).catch(e => {
    console.log(e)
  });