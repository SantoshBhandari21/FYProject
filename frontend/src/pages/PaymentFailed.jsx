import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AlertCircle, Home } from "lucide-react";

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
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
  color: #991b1b;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;

  h3 {
    margin: 0 0 0.75rem;
    color: #7f1d1d;
    font-weight: 700;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
    color: #991b1b;
    font-size: 0.9rem;
    line-height: 1.6;

    li {
      margin-bottom: 0.5rem;
    }
  }

  p {
    margin: 0;
    color: #991b1b;
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  display: inline-block;
  padding: 0.875rem 2rem;
  background: ${(props) =>
    props.$primary
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("Payment was not processed");

  useEffect(() => {
    // Parse reason from URL if available
    const params = new URLSearchParams(window.location.search);
    const errorReason = params.get("reason") || params.get("error");
    if (errorReason) {
      setReason(decodeURIComponent(errorReason));
    }
  }, []);

  return (
    <Container>
      <Card>
        <IconWrapper>
          <AlertCircle />
        </IconWrapper>
        <Title>Payment Failed</Title>
        <Subtitle>
          We were unable to process your payment through eSewa.
        </Subtitle>

        <ErrorBox>
          <p>{reason}</p>
          <h3 style={{ marginTop: "1rem" }}>What you can do:</h3>
          <ul>
            <li>Try the payment again</li>
            <li>Verify your eSewa account balance</li>
            <li>Check your internet connection</li>
            <li>Contact eSewa support if the problem persists</li>
          </ul>
        </ErrorBox>

        <ButtonGroup>
          <Button $primary onClick={() => navigate(-1)}>
            Try Payment Again
          </Button>
          <Button onClick={() => navigate("/browse-rooms")}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Home size={18} />
              Browse Other Rooms
            </div>
          </Button>
        </ButtonGroup>

        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.85rem",
            color: "#6b7280",
          }}
        >
          If you need assistance, please contact our support team.
        </p>
      </Card>
    </Container>
  );
};

export default PaymentFailed;
