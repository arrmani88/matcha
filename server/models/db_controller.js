const mysql = require('mysql')

try {
    const dbController = mysql.createConnection({
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: 'root',
        database: 'matcha'
    })
    module.exports = dbController
} catch (error) {
    console.log(err)
}