// Εισαγωγή βιβλιοθηκών.
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// Δημιουργία router.
const router = express.Router();

// Διαδρομή για εγγραφή χρήστη.
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Σύνδεση στη βάση δεδομένων και έλεγχος email.
    const conn = await db.getConnection();
    const rows = await conn.query(
      "SELECT * FROM clients WHERE client_email = ?",
      [email]
    );
    if (rows.length > 0) {
      conn.release();
      return res.status(409).json({ message: "Ο χρήστης υπάρχει ήδη." });
    }
    // Κρυπτογράφηση κωδικού.
    const hashed = await bcrypt.hash(password, 10);
    // Εισαγωγή νέου χρήστη.
    await conn.query(
      "INSERT INTO clients (client_name, client_email, client_password) VALUES (?, ?, ?)",
      [name, email, hashed]
    );
    conn.release();
    // Επιστροφή επιτυχίας.
    res.status(201).json({ message: "Ο χρήστης δημιουργήθηκε επιτυχώς!" });
  } catch (err) {
    console.error("Σφάλμα εγγραφής χρήστη:", err);
    res.status(500).json({ message: "Εσωτερικό σφάλμα διακομιστή." });
  }
});

// Διαδρομή για σύνδεση χρήστη.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Ανάκτηση χρήστη από τη βάση δεδομένων.
    const conn = await db.getConnection();
    const rows = await conn.query(
      "SELECT * FROM clients WHERE client_email = ?",
      [email]
    );
    conn.release();
    // Έλεγχος ύπαρξης και αντιστοιχίας του κωδικού.
    if (rows.length === 0) {
      return res.status(401).json({ message: "Λάθος email ή κωδικός." });
    }
    const client = rows[0];
    const ok = await bcrypt.compare(password, client.client_password);
    if (!ok) {
      return res.status(401).json({ message: "Λάθος email ή κωδικός." });
    }
    // Δημιουργία JWT με λήξη 2 ωρών (1).
    const payload = {
      id: client.client_id,
      name: client.client_name,
    };
    // Δημιουργία JWT με λήξη 2 ωρών (2).
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    // Αποστολή token.
    res.json({ token });
  } catch (err) {
    console.error("Σφάλμα κατά το login:", err);
    res.status(500).json({ message: "Εσωτερικό σφάλμα διακομιστή." });
  }
});

// Εξαγωγή router.
module.exports = router;
