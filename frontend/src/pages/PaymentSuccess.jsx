import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CheckCircle, AlertCircle } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const InfoBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: left;

  p {
    margin: 0.5rem 0;
    color: #166534;
    font-size: 0.9rem;

    strong {
      font-weight: 700;
    }
  }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: left;

  p {
    margin: 0.5rem 0;
    color: #991b1b;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  display: inline-block;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  margin: 1rem auto;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get eSewa callback parameters from URL
        const params = new URLSearchParams(location.search);
        const data = params.get("data");

        if (!data) {
          setStatus("error");
          setError("Payment verification data not found");
          return;
        }

        // Decode the base64 data from eSewa
        try {
          JSON.parse(atob(data));
        } catch (e) {
          console.error("Failed to decode eSewa data:", e);
          setStatus("error");
          setError("Invalid payment response format");
          return;
        }

        // Call backend to verify payment
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/payments/verify?data=${data}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const result = await response.json();

        if (response.ok && result.payment) {
          setStatus("success");
          setBookingDetails({
            bookingId: result.payment.booking_id,
            amount: result.payment.amount,
            transactionId: result.payment.esewa_reference_id,
          });
        } else {
          setStatus("error");
          setError(result.message || "Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setError(
          err.message || "An error occurred during payment verification",
        );
      }
    };

    verifyPayment();
  }, [location]);

  return (
    <Container>
      <Card>
        {status === "verifying" && (
          <>
            <LoadingSpinner />
            <Title>Verifying Payment</Title>
            <Subtitle>
              Please wait while we verify your payment with eSewa...
            </Subtitle>
          </>
        )}

        {status === "success" && (
          <>
            <IconWrapper>
              <CheckCircle />
            </IconWrapper>
            <Title>Payment Successful!</Title>
            <Subtitle>
              Your rental has been confirmed and payment received.
            </Subtitle>

            {bookingDetails && (
              <InfoBox>
                <p>
                  <strong>Booking ID:</strong> {bookingDetails.bookingId}
                </p>
                <p>
                  <strong>Amount Paid:</strong> Rs{" "}
                  {bookingDetails.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Transaction ID:</strong>{" "}
                  {bookingDetails.transactionId}
                </p>
              </InfoBox>
            )}

            <Subtitle style={{ marginBottom: "2rem" }}>
              You'll receive a confirmation email shortly. Check your dashboard
              for rental details.
            </Subtitle>

            <Button onClick={() => navigate("/client-dashboard")}>
              Go to Dashboard
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <IconWrapper
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              }}
            >
              <AlertCircle />
            </IconWrapper>
            <Title style={{ color: "#991b1b" }}>Payment Failed</Title>
            <Subtitle style={{ color: "#991b1b" }}>{error}</Subtitle>

            <ErrorBox>
              <p>
                Your payment could not be processed. Please try again or contact
                support if the problem persists.
              </p>
            </ErrorBox>

            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                onClick={() => navigate(-1)}
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/browse-rooms")}
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                }}
              >
                Browse Rooms
              </Button>
            </div>
          </>
        )}
      </Card>
    </Container>
  );
};

export default PaymentSuccess;
