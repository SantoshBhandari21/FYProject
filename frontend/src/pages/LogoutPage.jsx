import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f1f5f9;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 26px 28px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.08);
  color: #0f172a;
  font-weight: 800;
`;

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Page>
      <Card>You have been logged out.</Card>
    </Page>
  );
};

export default LogoutPage;
