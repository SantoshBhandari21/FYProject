// src/controllers/rentalController.js
const db = require("../config/database");

// Create a new rental request
exports.createRental = (req, res) => {
  try {
    const { roomId, months, totalPrice } = req.body;
    const clientId = req.user.id;

    // Validation
    if (!roomId || !months || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (months < 1) {
      return res
        .status(400)
        .json({ message: "Minimum rental period is 1 month" });
    }

    // Get room details
    db.get("SELECT * FROM rooms WHERE id = ?", [roomId], (err, room) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Check if room is available
      if (!room.is_available) {
        return res
          .status(400)
          .json({ message: "Room is not available for rent" });
      }

      const ownerId = room.owner_id;
      const moveInDate = new Date().toISOString().split("T")[0]; // Today
      const moveOutDate = new Date(
        Date.now() + months * 30 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0]; // Approximate: months * 30 days

      // Create rental (using bookings table)
      const sql = `
        INSERT INTO bookings (room_id, client_id, owner_id, booking_date, move_in_date, move_out_date, status, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const bookingDate = new Date().toISOString().split("T")[0];

      db.run(
        sql,
        [
          roomId,
          clientId,
          ownerId,
          bookingDate,
          moveInDate,
          moveOutDate,
          "pending_payment",
          totalPrice,
        ],
        function (err) {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Failed to create rental" });
          }

          // Don't create notification yet - wait for payment

          res.status(201).json({
            message: "Rental initiated. Please proceed with payment.",
            rentalId: this.lastID,
            totalPrice: totalPrice,
            months: months,
          });
        },
      );
    });
  } catch (err) {
    console.error("Error creating rental:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get my rentals (as client/tenant)
exports.getMyRentals = (req, res) => {
  try {
    const clientId = req.user.id;
    const { status } = req.query;

    let sql = `
      SELECT b.*, r.title, r.price, r.main_image, r.location, u.full_name as owner_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.owner_id = u.id
      WHERE b.client_id = ?
      ORDER BY b.created_at DESC
    `;

    const params = [clientId];

    if (status) {
      sql = sql.replace(
        "WHERE b.client_id = ?",
        "WHERE b.client_id = ? AND b.status = ?",
      );
      params.push(status);
    }

    db.all(sql, params, (err, rentals) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ rentals: rentals || [] });
    });
  } catch (err) {
    console.error("Error fetching rentals:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get rental requests (as room owner)
exports.getRentalRequests = (req, res) => {
  try {
    const ownerId = req.user.id;
    const { status } = req.query;

    let sql = `
      SELECT b.*, r.title, r.price, r.main_image, r.location, u.full_name as client_name, u.email as client_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.client_id = u.id
      WHERE b.owner_id = ?
      ORDER BY b.created_at DESC
    `;

    const params = [ownerId];

    if (status) {
      sql = sql.replace(
        "WHERE b.owner_id = ?",
        "WHERE b.owner_id = ? AND b.status = ?",
      );
      params.push(status);
    }

    db.all(sql, params, (err, requests) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ requests: requests || [] });
    });
  } catch (err) {
    console.error("Error fetching rental requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get rental details
exports.getRentalById = (req, res) => {
  try {
    const rentalId = req.params.id;

    db.get(
      `
      SELECT b.*, r.title, r.description, r.price, r.bedrooms, r.bathrooms, r.main_image, r.location, 
             u.full_name as owner_name, u.email as owner_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.owner_id = u.id
      WHERE b.id = ?
    `,
      [rentalId],
      (err, rental) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (!rental) {
          return res.status(404).json({ message: "Rental not found" });
        }

        res.json(rental);
      },
    );
  } catch (err) {
    console.error("Error fetching rental:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
