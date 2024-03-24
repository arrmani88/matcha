const mysql = require("mysql");

try {
  const dbController = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "matcha",
  });
  console.log("Connected to database");
  module.exports = dbController;
} catch (err) {
  console.log("not connected to db");
  console.log("Error connecting to database");
  console.log(err);
}
