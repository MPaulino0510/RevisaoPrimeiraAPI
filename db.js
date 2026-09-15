const mysql = require("mysql2/promise");

const conexao = mysql.createPool({

    host: "localhost",
    user: "root",
    password: "senai2026",
    database: "turmads1b",
    port:3306
});

module.exports = conexao;