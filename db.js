// make sql connection
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_db'
});

// connect to mysql
connection.connect(function(err){
    if(err) throw err;
})

module.exports = connection;