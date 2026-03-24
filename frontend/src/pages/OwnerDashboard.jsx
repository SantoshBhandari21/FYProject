import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OwnerDashboard.css";
import { roomAPI, getStoredUser } from "../services/api";
import RoomForm from "../components/RoomForm";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Check authentication and user role
  useEffect(() => {
    const user = getStoredUser();
    console.log("Current user:", user);

    if (!user) {
      console.warn("No user found, redirecting to login");
      navigate("/login");
      return;
    }

    if (user.role !== "owner") {
      console.warn("User is not an owner, redirecting to dashboard");
      navigate("/");
      return;
    }

    fetchMyRooms();
  }, [navigate]);

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching rooms...");
      const data = await roomAPI.getMyRooms();
      console.log("Rooms fetched successfully:", data);
      setRooms(data.rooms || []);
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch rooms";
      console.error("Fetch rooms error:", errorMsg, err);
      setError(errorMsg);

      // If unauthorized, redirect to login
      if (err.message && err.message.includes("401")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleSubmitRoom = async (formData) => {
    try {
      console.log("Submitting room, editing:", !!editingRoom);
      if (editingRoom) {
        // Update room
        console.log("Updating room:", editingRoom.id);
        await roomAPI.updateRoom(editingRoom.id, formData);
        console.log("Room updated successfully");
      } else {
        // Create new room
        console.log("Creating new room");
        await roomAPI.createRoom(formData);
        console.log("Room created successfully");
      }
      setShowModal(false);
      setEditingRoom(null);
      setError("");
      await fetchMyRooms();
    } catch (err) {
      const errorMsg = err.message || "Failed to save room";
      console.error("Save room error:", errorMsg, err);
      setError(errorMsg);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      console.log("Deleting room:", roomId);
      await roomAPI.deleteRoom(roomId);
      console.log("Room deleted successfully");
      setDeleteConfirm(null);
      setError("");
      await fetchMyRooms();
    } catch (err) {
      const errorMsg = err.message || "Failed to delete room";
      console.error("Delete room error:", errorMsg, err);
      setError(errorMsg);
    }
  };

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>My Rooms</h1>
          <p>
            Manage your room listings, add new properties, and track bookings
          </p>
        </div>
        <button className="btn-add-room" onClick={handleAddRoom}>
          + Add New Room
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading your rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="no-rooms">
          <p>You haven't added any rooms yet.</p>
          <button className="btn-primary" onClick={handleAddRoom}>
            Add Your First Room
          </button>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                <img
                  src={
                    room.main_image
                      ? room.main_image.startsWith("http")
                        ? room.main_image
                        : `http://localhost:5000${room.main_image}`
                      : "/placeholder.jpg"
                  }
                  alt={room.title}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
                <div className="room-status">
                  {room.is_available ? (
                    <span className="status-available">Available</span>
                  ) : (
                    <span className="status-unavailable">Unavailable</span>
                  )}
                </div>
              </div>

              <div className="room-content">
                <h3>{room.title}</h3>
                <p className="room-location">📍 {room.location}</p>
                <p className="room-address">{room.address}</p>

                <div className="room-details">
                  <span className="detail">{room.bedrooms} Beds</span>
                  <span className="detail">{room.bathrooms} Baths</span>
                </div>

                {room.description && (
                  <p className="room-description">{room.description}</p>
                )}

                <div className="room-footer">
                  <div className="room-price">
                    <span className="price">Rs {room.price}</span>
                    <span className="period">/month</span>
                  </div>
                  <div className="room-stats">
                    {room.avg_rating && (
                      <span className="rating">
                        ⭐ {room.avg_rating.toFixed(1)} ({room.review_count}{" "}
                        reviews)
                      </span>
                    )}
                  </div>
                </div>

                <div className="room-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditRoom(room)}
                    title="Edit room"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => setDeleteConfirm(room.id)}
                    title="Delete room"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Room Modal */}
      {showModal && (
        <RoomForm
          room={editingRoom}
          onSubmit={handleSubmitRoom}
          onClose={() => {
            setShowModal(false);
            setEditingRoom(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="modal-content delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Room?</h3>
            <p>
              Are you sure you want to delete this room? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-delete-confirm"
                onClick={() => handleDeleteRoom(deleteConfirm)}
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
