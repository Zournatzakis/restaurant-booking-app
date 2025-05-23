const express = require("express");
const db = require("../config/database");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Δημιουργία νέας κράτησης.
router.post("/", verifyToken, async (req, res) => {
  const { restaurant_id, reservation_date, reservation_time, people_count } =
    req.body;
  const client_id = req.user.id;
  let conn;

  try {
    conn = await db.getConnection();

    // Έλεγχος διπλής κράτησης (ίδιο εστιατόριο και ίδια ημερομηνία).
    const existing = await conn.query(
      `SELECT reservation_id
         FROM reservations
        WHERE client_id = ?
          AND restaurant_id = ?
          AND reservation_date = ?`,
      [client_id, restaurant_id, reservation_date]
    );
    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({
        message:
          "Έχετε ήδη μία κράτηση σε αυτό το εστιατόριο την ίδια ημερομηνία.",
      });
    }

    // Εισαγωγή νέας κράτησης.
    await conn.query(
      `INSERT INTO reservations
         (client_id, restaurant_id, reservation_date, reservation_time, people_count)
       VALUES (?, ?, ?, ?, ?)`,
      [
        client_id,
        restaurant_id,
        reservation_date,
        reservation_time,
        people_count,
      ]
    );
    conn.release();
    res.status(201).json({ message: "Κράτηση επιτυχής." });
  } catch (err) {
    console.error("Σφάλμα POST /reservations:", err);
    if (conn) conn.release();
    res.status(500).json({ message: "Εσωτερικό σφάλμα." });
  }
});

// Ενημέρωση υπάρχουσας κράτησης (επιτρέπεται μόνο στον δημιουργό).
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { reservation_date, reservation_time, people_count } = req.body;
  const client_id = req.user.id;
  let conn;

  try {
    conn = await db.getConnection();

    // 1) Παίρνουμε το restaurant_id της προς επεξεργασία κράτησης
    const existingRes = await conn.query(
      `SELECT restaurant_id
         FROM reservations
        WHERE reservation_id = ? AND client_id = ?`,
      [id, client_id]
    );
    if (existingRes.length === 0) {
      conn.release();
      return res.status(404).json({ message: "Κράτηση δεν βρέθηκε ή άδεια." });
    }
    const restaurant_id = existingRes[0].restaurant_id;

    // 2) Έλεγχος conflict με άλλη κράτηση την ίδια ημερομηνία
    const conflict = await conn.query(
      `SELECT reservation_id
         FROM reservations
        WHERE client_id = ?
          AND restaurant_id = ?
          AND reservation_date = ?
          AND reservation_id <> ?`,
      [client_id, restaurant_id, reservation_date, id]
    );
    if (conflict.length > 0) {
      conn.release();
      return res.status(409).json({
        message:
          "Έχετε ήδη μία άλλη κράτηση σε αυτό το εστιατόριο την ίδια ημερομηνία.",
      });
    }

    // 3) Εκτέλεση της ενημέρωσης
    const result = await conn.query(
      `UPDATE reservations
         SET reservation_date = ?, reservation_time = ?, people_count = ?
        WHERE reservation_id = ? AND client_id = ?`,
      [reservation_date, reservation_time, people_count, id, client_id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Κράτηση δεν βρέθηκε ή άδεια." });
    }
    res.json({ message: "Κράτηση ενημερώθηκε." });
  } catch (err) {
    console.error("Σφάλμα PUT /reservations:", err);
    if (conn) conn.release();
    res.status(500).json({ message: "Εσωτερικό σφάλμα." });
  }
});

// Διαγραφή κράτησης (μόνο από τον ιδιοκτήτη της).
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const client_id = req.user.id;
  let conn;

  try {
    conn = await db.getConnection();
    const result = await conn.query(
      `DELETE FROM reservations
         WHERE reservation_id = ? AND client_id = ?`,
      [id, client_id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Κράτηση δεν βρέθηκε ή άδεια." });
    }
    res.json({ message: "Κράτηση διαγράφηκε." });
  } catch (err) {
    console.error("Σφάλμα DELETE /reservations:", err);
    if (conn) conn.release();
    res.status(500).json({ message: "Εσωτερικό σφάλμα." });
  }
});

// Ανάκτηση όλων των κρατήσεων του χρήστη (με στοιχεία εστιατορίου).
router.get("/user", verifyToken, async (req, res) => {
  const client_id = req.user.id;
  let conn;

  try {
    conn = await db.getConnection();
    const rows = await conn.query(
      `SELECT 
         r.reservation_id,
         r.restaurant_id,
         res.restaurant_name,
         res.restaurant_location,
         res.restaurant_description,
         r.reservation_date,
         r.reservation_time,
         r.people_count
       FROM reservations r
       JOIN restaurants res ON r.restaurant_id = res.restaurant_id
       WHERE r.client_id = ?`,
      [client_id]
    );
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error("Σφάλμα GET /reservations/user:", err);
    if (conn) conn.release();
    res.status(500).json({ message: "Εσωτερικό σφάλμα." });
  }
});

module.exports = router;
