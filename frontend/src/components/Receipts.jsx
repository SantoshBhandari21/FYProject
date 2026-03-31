import React, { useState, useEffect } from "react";
import { paymentsAPI } from "../services/api";
import "./Receipts.css";

const Receipts = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await paymentsAPI.getMyPayments();
      setPayments(data.payments || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Failed to load receipts");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "pending":
        return "status-pending";
      case "initiated":
        return "status-initiated";
      case "failed":
        return "status-failed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "initiated":
        return "Initiated";
      case "failed":
        return "Failed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadReceipt = (payment) => {
    const receiptContent = `
=====================================
        PAYMENT RECEIPT
=====================================

Room ID: #${payment.room_id}
Room: ${payment.room_title}
Location: ${payment.room_location}

Owner: ${payment.owner_name}
Email: ${payment.owner_email}

===== RENTAL DETAILS =====
Move-in: ${new Date(payment.move_in_date).toLocaleDateString()}
Move-out: ${new Date(payment.move_out_date).toLocaleDateString()}

===== PAYMENT DETAILS =====
Amount: Rs. ${payment.amount}
Payment Method: ${payment.payment_method || "Khalti"}
Transaction ID: ${payment.transaction_id || "N/A"}
Status: ${getStatusLabel(payment.status)}

Payment Date: ${formatDate(payment.created_at)}

=====================================
    Thank you for your payment!
=====================================
    `;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(receiptContent)
    );
    element.setAttribute("download", `receipt-${payment.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printReceipt = (payment) => {
    const printWindow = window.open("", "", "width=600,height=800");
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; }
          .header { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #999; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .label { font-weight: 600; }
          .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">PAYMENT RECEIPT</div>
          
          <div class="section">
            <div class="section-title">Room Details</div>
            <div class="row">
              <span class="label">Room ID:</span>
              <span>#${payment.room_id}</span>
            </div>
            <div class="row">
              <span class="label">Room:</span>
              <span>${payment.room_title}</span>
            </div>
            <div class="row">
              <span class="label">Location:</span>
              <span>${payment.room_location}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Owner Information</div>
            <div class="row">
              <span class="label">Name:</span>
              <span>${payment.owner_name}</span>
            </div>
            <div class="row">
              <span class="label">Email:</span>
              <span>${payment.owner_email}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Rental Period</div>
            <div class="row">
              <span class="label">Move-in:</span>
              <span>${new Date(payment.move_in_date).toLocaleDateString()}</span>
            </div>
            <div class="row">
              <span class="label">Move-out:</span>
              <span>${new Date(payment.move_out_date).toLocaleDateString()}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payment Information</div>
            <div class="row">
              <span class="label">Amount:</span>
              <span>Rs. ${payment.amount}</span>
            </div>
            <div class="row">
              <span class="label">Method:</span>
              <span>${payment.payment_method || "Khalti"}</span>
            </div>
            <div class="row">
              <span class="label">Transaction ID:</span>
              <span>${payment.transaction_id || "N/A"}</span>
            </div>
            <div class="row">
              <span class="label">Status:</span>
              <span style="color: ${payment.status === "completed" ? "green" : "orange"}; font-weight: bold;">
                ${getStatusLabel(payment.status)}
              </span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span>${formatDate(payment.created_at)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your payment!</p>
            <p style="font-size: 12px; color: #999;">Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="receipts-container">
        <div className="loading">Loading your receipts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="receipts-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="receipts-container">
      <div className="receipts-header">
        <h2>Payment Receipts</h2>
        <p>View and download your payment receipts for room rentals</p>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <p>No payment receipts found. Start by making a payment for a room rental.</p>
        </div>
      ) : (
        <div className="receipts-list">
          {payments.map((payment) => (
            <div key={payment.id} className="receipt-card">
              <div className="receipt-header">
                <div className="receipt-title">
                  <h3>{payment.room_title}</h3>
                  <p className="receipt-subtitle">Room ID: #{payment.room_id}</p>
                </div>
                <span className={`status-badge ${getStatusColor(payment.status)}`}>
                  {getStatusLabel(payment.status)}
                </span>
              </div>

              <div className="receipt-content">
                {/* Room Info */}
                <div className="receipt-section">
                  <h4 className="section-title">Room Information</h4>
                  <div className="info-row">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{payment.room_location}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Owner:</span>
                    <span className="info-value">{payment.owner_name}</span>
                  </div>
                </div>

                {/* Rental Period */}
                <div className="receipt-section">
                  <h4 className="section-title">Rental Period</h4>
                  <div className="date-row">
                    <div className="date-item">
                      <span className="info-label">From:</span>
                      <span className="info-value">
                        {new Date(payment.move_in_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="date-item">
                      <span className="info-label">To:</span>
                      <span className="info-value">
                        {new Date(payment.move_out_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="receipt-section payment-highlight">
                  <h4 className="section-title">Payment Details</h4>
                  <div className="amount-row">
                    <span className="amount-label">Amount Paid:</span>
                    <span className="amount-value">Rs. {payment.amount}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Method:</span>
                    <span className="info-value">
                      {payment.payment_method || "Khalti"}
                    </span>
                  </div>
                  {payment.transaction_id && (
                    <div className="info-row">
                      <span className="info-label">Transaction ID:</span>
                      <span className="info-value text-mono">{payment.transaction_id}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{formatDate(payment.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="receipt-actions">
                <button
                  className="action-btn download-btn"
                  onClick={() => downloadReceipt(payment)}
                  title="Download receipt as text file"
                >
                  ⬇ Download
                </button>
                <button
                  className="action-btn print-btn"
                  onClick={() => printReceipt(payment)}
                  title="Print receipt"
                >
                  🖨 Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Receipts;
