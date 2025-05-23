const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Ενεργοποίηση CORS για τα cross-origin αιτήματα
app.use(cors());
// Αυτόματη ανάλυση JSON στο body των αιτημάτων
app.use(express.json());

// Middleware για τη καταγραφή όλων των αιτημάτων
app.use((req, res, next) => {
  console.log(`REQUEST: ${req.method} ${req.originalUrl}`);
  console.log("Body:", req.body);
  next();
});

// Σύνδεση στη βάση MariaDB μέσω pool
const db = require("./config/database.js");
db.getConnection()
  .then((conn) => {
    console.log("Η βάση MariaDB συνδέθηκε με επιτυχία!");
    conn.release();
  })
  .catch((err) => {
    console.error("Σφάλμα σύνδεσης με τη βάση MariaDB:", err);
  });

// Εισαγωγή των διαδρομών για authentication (εγγραφή / σύνδεση)
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Διαδρομή για τη διαχείριση εστιατορίων
const restaurantRoutes = require("./routes/restaurants");
app.use("/api/restaurants", restaurantRoutes);

// Διαδρομή για τη διαχείριση κρατήσεων
const reservationRoutes = require("./routes/reservations");
app.use("/api/reservations", reservationRoutes);

// Βασική ρίζα για έλεγχο λειτουργίας backend
app.get("/", (req, res) => {
  res.send("Το backend λειτουργεί σωστά!");
});

// Handler για μη έγκυρες διαδρομές (404)
app.use((req, res) => {
  res.status(404).json({ message: "Διαδρομή δεν βρέθηκε" });
});

// Εκκίνηση του server στην καθορισμένη θύρα
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Ο server τρέχει στη θύρα ${PORT}`);
});
