const mysql = require("mysql");

try {
  const dbController = mysql.createConnection({
    host: "localhost",
    port: 8080,
    user: "root",
    password: "root",
    database: "matcha",
  });
  console.log("Connected to database");
  module.exports = dbController;
} catch (err) {
  console.log("Error connecting to database");
  console.log(err);
}
