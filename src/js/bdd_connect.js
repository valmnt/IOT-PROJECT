const sql = require("mysql");

function connectBdd() {
  return (connection = sql.createConnection({
    host: "localhost",
    port: "3306",
    user: "covidAlert",
    password: "covidAlert",
    database: "covidAlert",
  }));
}

module.exports = {
  connectBdd,
};
