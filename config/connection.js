const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize("postgres", "postgres", "admin", {
//     host: "localhost",
//     port: 5432,
//     dialect: 'postgres',
//     logging:false,
//     dialectOptions:{
//       dateStrings: true,
//       typeCast: true,
//     },
//     timezone: '+07:00'
//   });
const sequelize = new Sequelize("SEROVA2", "postgres", "Grafika9", {
    host: "147.139.167.33",
    port: 5555,
    dialect: 'postgres',
    logging:false,
    dialectOptions:{
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+07:00'
  });

module.exports =  sequelize;