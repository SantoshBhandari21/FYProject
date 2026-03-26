import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { bookingsAPI, getStoredUser } from "../services/api";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin: 0;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button`
  padding: 12px 16px;
  border: none;
  background: none;
  color: ${(props) => (props.$active ? "#2563eb" : "#6b7280")};
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  cursor: pointer;
  border-bottom: ${(props) => (props.$active ? "2px solid #2563eb" : "none")};
  transition: all 0.2s ease;
  font-size: 15px;

  &:hover {
    color: #2563eb;
  }
`;

const RequestsGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RequestCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.$status) {
      case "pending":
        return "#fef3c7";
      case "approved":
        return "#dcfce7";
      case "rejected":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "pending":
        return "#92400e";
      case "approved":
        return "#166534";
      case "rejected":
        return "#991b1b";
      default:
        return "#6b7280";
    }
  }};
`;

const ClientName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoomTitle = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 8px 0;
  font-weight: 500;
`;

const Detail = styled.p`
  color: #6b7280;
  font-size: 13px;
  margin: 6px 0;
  display: flex;
  justify-content: space-between;

  strong {
    color: #1f2937;
  }
`;

const MessageBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  margin: 12px 0;
  font-size: 13px;
  color: #4b5563;
  max-height: 80px;
  overflow-y: auto;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  ${(props) =>
    props.$approve
      ? `
    background: #10b981;
    color: white;
    &:hover {
      background: #059669;
    }
    &:disabled {
      background: #d1fae5;
      cursor: not-allowed;
    }
  `
      : `
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
    }
    &:disabled {
      background: #fee2e2;
      cursor: not-allowed;
    }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  p {
    margin: 0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #6b7280;
`;

const BookingRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const fetchRequests = useCallback(
    async (status = activeTab) => {
      try {
        setLoading(true);
        setError("");
        const data = await bookingsAPI.getBookingRequests(
          status !== "all" ? status : null,
        );
        setRequests(data.requests || []);
      } catch (err) {
        setError(err.message || "Failed to load booking requests");
      } finally {
        setLoading(false);
      }
    },
    [activeTab],
  );

  // Check if user is owner
  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "owner") {
      navigate("/");
    } else {
      fetchRequests(activeTab);
    }
  }, [navigate, activeTab, fetchRequests]);

  const handleTabChange = (status) => {
    setActiveTab(status);
    fetchRequests(status);
  };

  const handleApprove = async (bookingId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [bookingId]: "approving" }));
      await bookingsAPI.updateBookingStatus(bookingId, "approved");
      await fetchRequests();
    } catch (err) {
      setError(err.message || "Failed to approve booking");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: null }));
    }
  };

  const handleReject = async (bookingId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [bookingId]: "rejecting" }));
      await bookingsAPI.updateBookingStatus(bookingId, "rejected");
      await fetchRequests();
    } catch (err) {
      setError(err.message || "Failed to reject booking");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: null }));
    }
  };

  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  return (
    <Container>
      <Header>
        <Title>Booking Requests</Title>
        <Subtitle>Manage and respond to booking requests from clients</Subtitle>
      </Header>

      <TabsContainer>
        <Tab
          $active={activeTab === "pending"}
          onClick={() => handleTabChange("pending")}
        >
          Pending ({requests.filter((r) => r.status === "pending").length})
        </Tab>
        <Tab
          $active={activeTab === "approved"}
          onClick={() => handleTabChange("approved")}
        >
          Approved ({requests.filter((r) => r.status === "approved").length})
        </Tab>
        <Tab
          $active={activeTab === "rejected"}
          onClick={() => handleTabChange("rejected")}
        >
          Rejected ({requests.filter((r) => r.status === "rejected").length})
        </Tab>
        <Tab
          $active={activeTab === "all"}
          onClick={() => handleTabChange("all")}
        >
          All
        </Tab>
      </TabsContainer>

      {error && (
        <div
          style={{
            color: "#dc2626",
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#fee2e2",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <LoadingContainer>Loading booking requests...</LoadingContainer>
      ) : filteredRequests.length === 0 ? (
        <EmptyState>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3>No {activeTab !== "all" ? activeTab : ""} booking requests</h3>
          <p>
            You don't have any {activeTab !== "all" ? activeTab : ""} booking
            requests right now
          </p>
        </EmptyState>
      ) : (
        <RequestsGrid>
          {filteredRequests.map((request) => (
            <RequestCard key={request.id}>
              <ClientName>
                👤 {request.client_name}
                <StatusBadge $status={request.status}>
                  {request.status}
                </StatusBadge>
              </ClientName>

              <RoomTitle>📍 {request.room_title}</RoomTitle>
              <Detail>
                <strong>Check-in:</strong>{" "}
                {new Date(request.move_in_date).toLocaleDateString()}
              </Detail>
              {request.move_out_date && (
                <Detail>
                  <strong>Check-out:</strong>{" "}
                  {new Date(request.move_out_date).toLocaleDateString()}
                </Detail>
              )}
              <Detail>
                <strong>Total Price:</strong> Rs {request.total_price}
              </Detail>
              <Detail>
                <strong>Client Email:</strong> {request.client_email}
              </Detail>

              {request.message && (
                <>
                  <Detail style={{ marginTop: "12px" }}>
                    <strong>Message:</strong>
                  </Detail>
                  <MessageBox>{request.message}</MessageBox>
                </>
              )}

              {request.status === "pending" && (
                <Actions>
                  <ActionBtn
                    $approve
                    onClick={() => handleApprove(request.id)}
                    disabled={actionLoading[request.id]}
                  >
                    {actionLoading[request.id] === "approving"
                      ? "Approving..."
                      : "✓ Approve"}
                  </ActionBtn>
                  <ActionBtn
                    onClick={() => handleReject(request.id)}
                    disabled={actionLoading[request.id]}
                  >
                    {actionLoading[request.id] === "rejecting"
                      ? "Rejecting..."
                      : "✕ Decline"}
                  </ActionBtn>
                </Actions>
              )}
            </RequestCard>
          ))}
        </RequestsGrid>
      )}
    </Container>
  );
};

export default BookingRequests;
