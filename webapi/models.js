const { Sequelize, Model, DataTypes } = require("sequelize");

// SEQUELIZE

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "evelinka99.atthost24.pl",
  username: "5795_run",
  password: "Pj737@p#o2f!e",
  database: "5795_run",
});

// MODELS

class User extends Model {}
User.init(
  {
    clientip: DataTypes.STRING,
    serverip: DataTypes.STRING,
    date: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "user" }
);

class McServer extends Model {}
McServer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ip: DataTypes.STRING,
    domain: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    views: DataTypes.INTEGER,
    premium: DataTypes.DATE,
    tags: DataTypes.STRING,
  },
  { sequelize, modelName: "mcserver" }
);

// INIT DATABASe

async function init_database() {
  await sequelize.authenticate();
  await sequelize.sync(); // to tworzy tabele dla wszystkich modeli

  console.log("connected to database");
}

init_database().catch((error) => console.log(error));

module.exports = { User, McServer };
