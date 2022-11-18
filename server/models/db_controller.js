const mysql = require("mysql");

try {
  const dbController = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "hypertube",
  });
  module.exports = dbController;
} catch (err) {
  console.log(err);
}
