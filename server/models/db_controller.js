const mysql = require("mysql");

try {
  const dbController = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "matcha",
  });
  module.exports = dbController;
} catch (err) {
  console.log(err);
}
