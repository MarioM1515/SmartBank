const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Registrovan");
        }
    );
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, results) => {
            if (err) return res.status(500).send(err);

            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(401).send("Pogrešan login");
            }
        }
    );
});

// GET BALANCE
app.get("/balance/:id", (req, res) => {
    db.query(
        "SELECT balance FROM users WHERE id=?",
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).send(err);

            if (results.length === 0) {
                return res.status(404).send("User ne postoji");
            }

            res.json(results[0]);
        }
    );
});

// UPDATE BALANCE
app.post("/update-balance", (req, res) => {
    const { id, amount, type } = req.body;

    let query =
        type === "deposit"
            ? "UPDATE users SET balance = balance + ? WHERE id=?"
            : "UPDATE users SET balance = balance - ? WHERE id=?";

    db.query(query, [amount, id], (err) => {
        if (err) return res.status(500).send(err);

        // UBACI TRANSAKCIJU
        db.query(
            "INSERT INTO transactions (user_id, amount, type) VALUES (?, ?, ?)",
            [id, amount, type]
        );

        res.send("Updated");
    });
});

//GET TRANSAKCIJE
app.get("/transactions/:id", (req, res) => {
    db.query(
        "SELECT * FROM transactions WHERE user_id=? ORDER BY date DESC",
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        }
    );
});




app.listen(3000, () => console.log("Server radi 300"));