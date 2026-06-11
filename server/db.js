 const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "budget_app"
});

db.connect(err => {
    if (err) console.log(err);
    else console.log("Povezan sa bazom");
});

module.exports = db;