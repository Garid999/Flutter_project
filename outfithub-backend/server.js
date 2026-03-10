const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Frost0526@",
  database: "outfithub"
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
    if (result.length > 0) {
      return res.json({ message: "This name already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      () => {
        res.json({ message: "Registered successfully" });
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});