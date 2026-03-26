// src/controllers/bookingController.js
const { runQuery, getOne, getAll } = require("../config/database");
const { createNotification } = require("./notificationController");

// Create new booking (Client only)
const createBooking = async (req, res) => {
  try {
    const { roomId, moveInDate, moveOutDate, message } = req.body;

    if (!roomId || !moveInDate) {
      return res
        .status(400)
        .json({ message: "Room ID and move-in date are required" });
    }

    const room = await getOne(
      "SELECT * FROM rooms WHERE id = ? AND is_available = 1",
      [roomId],
    );

    if (!room)
      return res
        .status(404)
        .json({ message: "Room not found or not available" });

    if (room.owner_id === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot book your own property" });
    }

    const moveIn = new Date(moveInDate);
    const moveOut = moveOutDate ? new Date(moveOutDate) : null;
    let totalPrice = room.price;

    if (moveOut) {
      const months = Math.ceil((moveOut - moveIn) / (1000 * 60 * 60 * 24 * 30));
      totalPrice = room.price * Math.max(1, months);
    }

    const result = await runQuery(
      `INSERT INTO bookings
       (room_id, client_id, owner_id, booking_date, move_in_date, move_out_date,
        total_price, message, status)
       VALUES (?, ?, ?, CURRENT_DATE, ?, ?, ?, ?, 'pending')`,
      [
        roomId,
        req.user.id,
        room.owner_id,
        moveInDate,
        moveOutDate || null,
        totalPrice,
        message || null,
      ],
    );

    const booking = await getOne(
      `SELECT b.*, r.title as room_title, r.address as room_address,
              u.full_name as client_name, u.email as client_email
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.client_id = u.id
       WHERE b.id = ?`,
      [result.id],
    );

    // Create notification for owner about new booking request
    const clientUser = await getOne(
      "SELECT full_name FROM users WHERE id = ?",
      [req.user.id],
    );
    await createNotification(
      room.owner_id,
      "booking_request",
      "New Booking Request",
      `${clientUser.full_name} requested to book "${room.title}" starting ${moveInDate}`,
      result.id,
    );

    return res
      .status(201)
      .json({ message: "Booking request submitted successfully", booking });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get bookings for client
const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT b.*, r.title as room_title, r.address as room_address,
             r.main_image as room_image, r.price as room_price,
             u.full_name as owner_name, u.email as owner_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.owner_id = u.id
      WHERE b.client_id = ?
    `;

    const params = [req.user.id];

    if (status) {
      query += " AND b.status = ?";
      params.push(status);
    }

    query += " ORDER BY b.created_at DESC";

    const bookings = await getAll(query, params);
    return res.json({ bookings });
  } catch (error) {
    console.error("Get my bookings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Owner booking requests
const getBookingRequests = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT b.*, r.title as room_title, r.address as room_address,
             u.full_name as client_name, u.email as client_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.client_id = u.id
      WHERE b.owner_id = ?
    `;

    const params = [req.user.id];

    if (status) {
      query += " AND b.status = ?";
      params.push(status);
    }

    query += " ORDER BY b.created_at DESC";

    const requests = await getAll(query, params);
    return res.json({ requests });
  } catch (error) {
    console.error("Get booking requests error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await getOne(
      `SELECT b.*, r.title as room_title, r.description as room_description,
              r.address as room_address, r.main_image as room_image, r.price as room_price,
              r.bedrooms, r.bathrooms, r.area, r.amenities,
              client.full_name as client_name, client.email as client_email,
              owner.full_name as owner_name, owner.email as owner_email
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users client ON b.client_id = client.id
       JOIN users owner ON b.owner_id = owner.id
       WHERE b.id = ?`,
      [req.params.id],
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      booking.client_id !== req.user.id &&
      booking.owner_id !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    booking.amenities = booking.amenities ? JSON.parse(booking.amenities) : [];
    return res.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update booking status (Owner)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Must be approved or rejected" });
    }

    const booking = await getOne(
      "SELECT * FROM bookings WHERE id = ? AND owner_id = ?",
      [req.params.id, req.user.id],
    );

    if (!booking)
      return res
        .status(404)
        .json({ message: "Booking not found or no permission" });

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending bookings can be approved or rejected" });
    }

    await runQuery(
      "UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, req.params.id],
    );

    // Create notification for client about booking decision
    const room = await getOne("SELECT title FROM rooms WHERE id = ?", [
      booking.room_id,
    ]);
    const notificationType =
      status === "approved" ? "booking_approved" : "booking_rejected";
    const notificationTitle =
      status === "approved"
        ? "Booking Approved! ✅"
        : "Booking Request Declined ❌";
    const notificationMessage =
      status === "approved"
        ? `Your booking request for "${room.title}" has been approved!`
        : `Your booking request for "${room.title}" has been declined.`;

    await createNotification(
      booking.client_id,
      notificationType,
      notificationTitle,
      notificationMessage,
      booking.id,
    );

    return res.json({ message: `Booking ${status} successfully`, status });
  } catch (error) {
    console.error("Update booking status error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Cancel booking (Client)
const cancelBooking = async (req, res) => {
  try {
    const booking = await getOne(
      "SELECT * FROM bookings WHERE id = ? AND client_id = ?",
      [req.params.id, req.user.id],
    );

    if (!booking)
      return res
        .status(404)
        .json({ message: "Booking not found or no permission" });

    if (!["pending", "approved"].includes(booking.status)) {
      return res
        .status(400)
        .json({
          message: "Only pending or approved bookings can be cancelled",
        });
    }

    await runQuery(
      "UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      ["cancelled", req.params.id],
    );

    return res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Complete booking (Owner)
const completeBooking = async (req, res) => {
  try {
    const booking = await getOne(
      "SELECT * FROM bookings WHERE id = ? AND owner_id = ?",
      [req.params.id, req.user.id],
    );

    if (!booking)
      return res
        .status(404)
        .json({ message: "Booking not found or no permission" });

    if (booking.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Only approved bookings can be completed" });
    }

    await runQuery(
      "UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      ["completed", req.params.id],
    );

    return res.json({ message: "Booking marked as completed" });
  } catch (error) {
    console.error("Complete booking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add review (Client)
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating is required and must be between 1 and 5" });
    }

    const booking = await getOne(
      "SELECT * FROM bookings WHERE id = ? AND client_id = ?",
      [req.params.id, req.user.id],
    );

    if (!booking)
      return res
        .status(404)
        .json({ message: "Booking not found or no permission" });

    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review completed bookings" });
    }

    const existingReview = await getOne(
      "SELECT id FROM reviews WHERE room_id = ? AND client_id = ?",
      [booking.room_id, req.user.id],
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this room" });
    }

    await runQuery(
      "INSERT INTO reviews (room_id, client_id, rating, comment) VALUES (?, ?, ?, ?)",
      [booking.room_id, req.user.id, rating, comment || null],
    );

    return res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Add review error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Owner stats
const getOwnerStats = async (req, res) => {
  try {
    const { total_bookings } = await getOne(
      "SELECT COUNT(*) as total_bookings FROM bookings WHERE owner_id = ?",
      [req.user.id],
    );

    const { pending_bookings } = await getOne(
      "SELECT COUNT(*) as pending_bookings FROM bookings WHERE owner_id = ? AND status = ?",
      [req.user.id, "pending"],
    );

    const { approved_bookings } = await getOne(
      "SELECT COUNT(*) as approved_bookings FROM bookings WHERE owner_id = ? AND status = ?",
      [req.user.id, "approved"],
    );

    const { total_earnings } = await getOne(
      "SELECT COALESCE(SUM(total_price), 0) as total_earnings FROM bookings WHERE owner_id = ? AND status IN (?, ?)",
      [req.user.id, "approved", "completed"],
    );

    const { total_rooms } = await getOne(
      "SELECT COUNT(*) as total_rooms FROM rooms WHERE owner_id = ?",
      [req.user.id],
    );

    return res.json({
      stats: {
        total_bookings,
        pending_bookings,
        approved_bookings,
        total_earnings,
        total_rooms,
      },
    });
  } catch (error) {
    console.error("Get owner stats error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingRequests,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  completeBooking,
  addReview,
  getOwnerStats,
};
