import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getStoredUser, authAPI } from "../services/api";

const Page = styled.div`
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  border-bottom: 2px solid #e7edf5;
  padding-bottom: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: #0f172a;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  background: #f8fafc;
  color: #0f172a;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(37, 99, 235, 0.6);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    background: #ffffff;
  }

  &:disabled {
    background: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorBox = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const SuccessBox = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #166534;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.$role) {
      case "admin":
        return "#fee2e2";
      case "owner":
        return "#fef3c7";
      case "tenant":
        return "#dcfce7";
      default:
        return "#f1f5f9";
    }
  }};
  color: ${(props) => {
    switch (props.$role) {
      case "admin":
        return "#991b1b";
      case "owner":
        return "#92400e";
      case "tenant":
        return "#166534";
      default:
        return "#475569";
    }
  }};
`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.currentPassword) {
      setError("Current password is required");
      return;
    }

    if (!formData.newPassword) {
      setError("New password is required");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      setSubmitting(true);
      await authAPI.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <Container>
          <p style={{ textAlign: "center", color: "#64748b" }}>
            Loading profile...
          </p>
        </Container>
      </Page>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Page>
      <Container>
        <Header>
          <Title>My Profile</Title>
          <Subtitle>Manage your account settings</Subtitle>
        </Header>

        {error && <ErrorBox>{error}</ErrorBox>}
        {success && <SuccessBox>{success}</SuccessBox>}

        {/* User Information */}
        <Section>
          <SectionTitle>Account Information</SectionTitle>

          <InfoGroup>
            <Label>Email Address</Label>
            <Input type="email" value={user.email || ""} disabled />
            <p
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                margin: "0.25rem 0 0",
              }}
            >
              Email cannot be changed
            </p>
          </InfoGroup>

          <InfoGroup>
            <Label>Full Name</Label>
            <Input type="text" value={user.full_name || ""} disabled />
          </InfoGroup>

          <InfoGroup>
            <Label>Role</Label>
            <RoleBadge $role={user.role}>{user.role}</RoleBadge>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                margin: "0.25rem 0 0",
              }}
            >
              Role cannot be changed
            </p>
          </InfoGroup>
        </Section>

        {/* Change Password */}
        <Section>
          <SectionTitle>Change Password</SectionTitle>

          <Form onSubmit={handlePasswordChange}>
            <InfoGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter your current password"
                disabled={submitting}
              />
            </InfoGroup>

            <InfoGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter a new password"
                disabled={submitting}
              />
            </InfoGroup>

            <InfoGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                disabled={submitting}
              />
            </InfoGroup>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Password"}
            </Button>
          </Form>
        </Section>
      </Container>
    </Page>
  );
};

export default ProfilePage;

