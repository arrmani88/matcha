const mysql = require('mysql')

try {
    const dbController = mysql.createConnection({
        host: '192.168.99.117',
        user: 'root',
        password: 'root',
        database: 'matcha'
    })
    module.exports = dbController
} catch (error) {
    console.log(err)
}