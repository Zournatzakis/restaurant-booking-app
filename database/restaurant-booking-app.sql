-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: localhost
-- Χρόνος δημιουργίας: 23 Μάη 2025 στις 09:46:44
-- Έκδοση διακομιστή: 10.4.28-MariaDB
-- Έκδοση PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `restaurant_booking_app`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `client_name` varchar(100) DEFAULT NULL,
  `client_email` varchar(100) DEFAULT NULL,
  `client_password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `clients`
--

INSERT INTO `clients` (`client_id`, `client_name`, `client_email`, `client_password`) VALUES
(1, 'Zournatzakis', 'zournatzakis@gmail.com', '$2b$10$lCH9VGWOEF6veI2Qw91Ky.rDZPaPR9CVOtc.CsRPzSlRT2qwx0bL6');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `reservation_date` date DEFAULT NULL,
  `reservation_time` time DEFAULT NULL,
  `people_count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `restaurants`
--

CREATE TABLE `restaurants` (
  `restaurant_id` int(11) NOT NULL,
  `restaurant_name` varchar(100) DEFAULT NULL,
  `restaurant_location` varchar(100) DEFAULT NULL,
  `restaurant_description` text DEFAULT NULL,
  `daily_limit` int(11) NOT NULL DEFAULT 20
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `restaurants`
--

INSERT INTO `restaurants` (`restaurant_id`, `restaurant_name`, `restaurant_location`, `restaurant_description`, `daily_limit`) VALUES
(1, 'Το Αθηναϊκό Στέκι', 'Αθήνα', 'Ποικιλία με παραδοσιακές πρώτες ύλες και σύγχρονη μαεστρία.', 25),
(2, 'Ο Νίκος', 'Θεσσαλονίκη', 'Ταβέρνα με εκλεπτυσμένους μεζέδες και επιλεγμένες ποικιλίες κρεάτων.', 20),
(3, 'Η Αυλή', 'Χανιά', 'Κρητική κουζίνα υψηλού επιπέδου σε μοναδική ατμόσφαιρα αυλής.', 18),
(4, 'Η Γωνία', 'Πάτρα', 'Ψητά από φρέσκα υλικά ημέρας με την υπογραφή των τοπικών μας σεφ.', 22),
(5, 'Παράδοση', 'Ηράκλειο', 'Αυθεντικές συνταγές Κρήτης με παραδοσιακή τεχνική και σύγχρονη παρουσίαση.', 20),
(6, 'Πελαργός', 'Λευκάδα', 'Γαστρονομική εμπειρία θαλασσινών με premium υλικά και εκλεπτυσμένη γεύση.', 24),
(7, 'Γεύσεις Καρδίτσας', 'Καρδίτσα', 'Κεντροελλαδίτικη κουζίνα με γκουρμέ και τοπικές πρώτες ύλες.', 16),
(8, 'Ταβέρνα Ο Μάρκος', 'Κέρκυρα', 'Μεσογειακές δημιουργίες με έμφαση στα φρέσκα ψάρια του τόπου μας.', 20),
(9, 'Παραδοσιακό', 'Λάρισα', 'Σπιτικά πιάτα ημέρα με επιλεγμένα και φρέσκα υλικά.', 18),
(10, 'Κυκλαδίτικο Στέκι', 'Μύκονος', 'Νησιώτικη γαστρονομία με φρέσκες πρώτες ύλες και κομψή ατμόσφαιρα.', 26),
(11, 'Ocean Breeze', 'Σαντορίνη', 'Ποικιλίες φαγητών με θέα στο ηφαίστειο και δημιουργικά ελληνικά πιάτα.', 20),
(12, 'Μετέωρα Gourmet', 'Καλαμπάκα', 'Σύγχρονη ελληνική κουζίνα εμπνευσμένη από τα Μετέωρα.', 16),
(13, 'Ναύπλιο Signature', 'Ναύπλιο', 'Γαστρονομικό ταξίδι με κλασικές συνταγές και premium τοπικά προϊόντα.', 22),
(14, 'Χιακόν Δείπνον', 'Χίος', 'Αρχαίες γεύσεις με σύγχρονες τεχνικές και μοναδική παρουσίαση.', 17),
(15, 'Ζακυνθινό Παράδεισος', 'Ζάκυνθος', 'Αυθεντικά νησιώτικα πιάτα, premium θαλασσινά και δημιουργικά pairing.', 20),
(16, 'Σκιαθίτικη Γαστρονομία', 'Σκιάθος', 'Εξαιρετικά θαλασσινά σε μοντέρνα εκτέλεση και minimal ατμόσφαιρα.', 18),
(17, 'Κωστικό Μενού', 'Κως', 'Γεύσεις Δωδεκανήσου με σύγχρονο χαρακτήρα και τοπικά κρασιά.', 19),
(18, 'Ξανθιώτικο Dine-In', 'Ξάνθη', 'Συνδυασμός Μακεδονικής και Ανατολίτικης παράδοσης σε μοντέρνο πιάτο.', 16),
(19, 'Κοζανίτικο Grill', 'Κοζάνη', 'Μοσχαρίσια κρέατα υψηλής ποιότητας, παραδοσιακές τεχνικές ψησίματος.', 15),
(20, 'Σερραϊκά Γευσιγνωσία', 'Σέρρες', 'Fine comfort food με τοπικά προϊόντα και δημιουργική προσέγγιση.', 17),
(21, 'Χαλκιδικιώτικη Θάλασσα', 'Χαλκίδα', 'Γαστρονομία Ιονίου με premium ψάρια και εκλεπτυσμένες γεύσεις.', 20),
(22, 'Πανδαισία Ρόδου', 'Ρόδος', 'Νησιώτικη κουζίνα με gourmet επιρροές και κομψή πολυτέλεια.', 23),
(23, 'Μεσσηνιακή Απόλαυση', 'Καλαμάτα', 'Κλασικά μεσογειακά πιάτα με premium έξτρα παρθένο ελαιόλαδο.', 19),
(24, 'Λευκαδίτικη Ιστορία', 'Λευκάδα', 'Γεύσεις Ιονίου με μοντέρνες τεχνικές και τοπικά παρελκόμενα.', 22),
(25, 'Μυκονιάτικες Γεύσεις', 'Μύκονος', 'Νησιώτικη fine dining εμπειρία με minimal αισθητική.', 25),
(26, 'Κερκυραϊκή Παράδοση', 'Κέρκυρα', 'Παραδοσιακά πιάτα με gourmet υλικά και σύγχρονες πινελιές.', 20),
(27, 'Ηπειρώτικο Στέκι', 'Ιωάννινα', 'Γεύσεις Ηπείρου με αγνά υλικά και δημιουργική παρουσίαση.', 18),
(28, 'Τριπολιτσιώτικο', 'Τρίπολη', 'Σπιτικές γεύσεις Αρκαδίας σε εκλεπτυσμένο περιβάλλον.', 17),
(29, 'Αγρινιώτικος', 'Αγρίνιο', 'Δυτικοελλαδίτικες γεύσεις με premium τοπικά προϊόντα.', 16),
(30, 'Ρεθυμνιώτικη Κουζίνα', 'Ρέθυμνο', 'Κρητική κουζίνα με αναβαθμισμένη αισθητική και σύγχρονες τεχνικές.', 18);

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`),
  ADD UNIQUE KEY `client_email` (`client_email`);

--
-- Ευρετήρια για πίνακα `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `restaurant_id` (`restaurant_id`);

--
-- Ευρετήρια για πίνακα `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`restaurant_id`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT για πίνακα `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `restaurant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
