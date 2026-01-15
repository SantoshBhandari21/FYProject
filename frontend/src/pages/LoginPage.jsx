import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { login } from "../services/authService";

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: #f1f5f9;
`;

const Card = styled.div`
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  padding: 32px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.08);

  @media (max-width: 480px) {
    padding: 22px;
  }
`;

const Title = styled.h2`
  margin: 0 0 8px;
  font-weight: 900;
  color: #0f172a;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  color: #475569;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  background: #f8fafc;
  color: #0f172a;

  &:focus {
    outline: none;
    border-color: rgba(37, 99, 235, 0.6);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background: #ffffff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 900;
  cursor: pointer;

  &:hover {
    background: #1e40af;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ErrorBox = styled.div`
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 13px;
`;

const Footer = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: center;
  font-size: 14px;
`;

const SmallLink = styled(Link)`
  color: #2563eb;
  text-decoration: none;
  font-weight: 800;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo; // tenant return path (optional)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      // Owner/Admin always go to their dashboards
      if (user.role === "owner") {
        navigate("/owner/dashboard", { replace: true });
        return;
      }

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // Tenant/Client: return to intended room if available
      if (returnTo) {
        navigate(returnTo, { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>Login</Title>
        <Sub>Enter your email and password.</Sub>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <Footer>
          <SmallLink to="/register?type=tenant">Create an account</SmallLink>
        </Footer>
      </Card>
    </Page>
  );
};

export default LoginPage;
