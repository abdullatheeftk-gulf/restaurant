const { Sequelize } = require("sequelize");

// const user = "postgres";
// const host = "localhost";
// const database = "restaurent";
// const password = "palotil";
// const port = "5432";

const user = "efvsaljdbkdsvc";
const host = "ec2-54-85-56-210.compute-1.amazonaws.com";
const database = "dh99p8em4oav2";
const password = "ab1a3246ae1debced4c2a7a9ba872593ef88294eaf7be928a005b559d1bf6e4a";
const port = "5432";

//  const user = "postgres";
//  const host = "database-1.cxtx2dcvv0dz.ap-south-1.rds.amazonaws.com";
//  const database = "database-1";
//  const password = "Trippanachi21";
//  const port = "5432";



const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: "postgres",
  logging: false,
  dialectOptions:{
    ssl:{
        require:true,
        rejectUnauthorized: false,
    }
}
});


module.exports = sequelize;
