const jwt = require("jsonwebtoken");

// Επαλήθευση JWT token από το header "Authorization".
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Χωρίς token." });

  // Αν δεν υπάρχει header επιστροφή σφάλμα 401.
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Άκυρο token." });
  }

  try {
    // Επαλήθευση του token.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Προσθήκη στοιχείων χρήστη στο req για επόμενο middleware.
    req.user = { id: payload.id, name: payload.name };
    next();
  } catch {
    // Μη έγκυρο ή εκπρόθεσμο token.
    return res.status(401).json({ message: "Άκυρο ή εκπρόθεσμο token." });
  }
}

module.exports = verifyToken;
