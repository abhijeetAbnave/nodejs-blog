const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "my-node-database-instance-1.c55is9hiww2v.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "Abhijeet"
});

con.connect(function(err) {
    if (err) throw err;

    con.query('CREATE DATABASE IF NOT EXISTS main;');
    con.query('USE main;');
    con.query('CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, username varchar(30), email varchar(255), age int, password varchar(30), PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
    });
    // con.end();
});

module.exports = con;