const mysql = require('mysql')

try {
    const dbController = mysql.createConnection({
        host: '192.168.99.114',
        user: 'root',
        password: 'root',
        database: 'matcha'
    })
    module.exports = dbController
} catch (error) {
    console.log(err)
} 