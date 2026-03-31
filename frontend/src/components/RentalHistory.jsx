import React, { useState, useEffect } from "react";
import { rentalsAPI } from "../services/api";
import "./RentalHistory.css";

const RentalHistory = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await rentalsAPI.getMyRentals();
      setRentals(data.rentals || []);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError(err.message || "Failed to load rental history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending_payment":
        return "status-pending-payment";
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "completed":
        return "status-completed";
      case "rejected":
        return "status-rejected";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending_payment":
        return "Pending Payment";
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "completed":
        return "Completed";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const filteredRentals = selectedStatus === "all" 
    ? rentals 
    : rentals.filter(r => r.status === selectedStatus);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="rental-history-container">
        <div className="loading">Loading your rental history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rental-history-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="rental-history-container">
      <div className="rental-history-header">
        <h2>Rental History</h2>
        <p>View all your room rental records</p>
      </div>

      {/* Status Filter */}
      <div className="status-filter">
        <button
          className={`filter-btn ${selectedStatus === "all" ? "active" : ""}`}
          onClick={() => setSelectedStatus("all")}
        >
          All ({rentals.length})
        </button>
        <button
          className={`filter-btn ${selectedStatus === "pending_payment" ? "active" : ""}`}
          onClick={() => setSelectedStatus("pending_payment")}
        >
          Pending Payment (
          {rentals.filter(r => r.status === "pending_payment").length})
        </button>
        <button
          className={`filter-btn ${selectedStatus === "approved" ? "active" : ""}`}
          onClick={() => setSelectedStatus("approved")}
        >
          Approved ({rentals.filter(r => r.status === "approved").length})
        </button>
        <button
          className={`filter-btn ${selectedStatus === "completed" ? "active" : ""}`}
          onClick={() => setSelectedStatus("completed")}
        >
          Completed ({rentals.filter(r => r.status === "completed").length})
        </button>
      </div>

      {/* Rentals List */}
      {filteredRentals.length === 0 ? (
        <div className="empty-state">
          <p>No rental records found for this filter.</p>
        </div>
      ) : (
        <div className="rentals-list">
          {filteredRentals.map((rental) => (
            <div key={rental.id} className="rental-card">
              <div className="rental-card-header">
                <div className="rental-info">
                  <h3>{rental.title}</h3>
                  <p className="rental-location">📍 {rental.location}</p>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(rental.status)}`}>
                  {getStatusLabel(rental.status)}
                </span>
              </div>

              <div className="rental-details">
                <div className="detail-item">
                  <span className="detail-label">Room ID:</span>
                  <span className="detail-value">#{rental.room_id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Owner:</span>
                  <span className="detail-value">{rental.owner_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price/Month:</span>
                  <span className="detail-value">Rs. {rental.price}</span>
                </div>
              </div>

              <div className="rental-dates">
                <div className="date-item">
                  <span className="date-label">Move-in:</span>
                  <span className="date-value">{formatDate(rental.move_in_date)}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">Move-out:</span>
                  <span className="date-value">
                    {rental.move_out_date ? formatDate(rental.move_out_date) : "N/A"}
                  </span>
                </div>
              </div>

              <div className="rental-amount">
                <span className="amount-label">Total Amount:</span>
                <span className="amount-value">Rs. {rental.total_price}</span>
              </div>

              {rental.main_image && (
                <img 
                  src={rental.main_image} 
                  alt={rental.title}
                  className="rental-thumbnail"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalHistory;
