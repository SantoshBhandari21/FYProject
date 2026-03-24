import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authAPI, getStoredUser } from "../services/api";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: #1e293b;
`;

const Title = styled.h1`
  font-size: 32px;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const CardTitle = styled.h2`
  font-size: 22px;
  color: #1e293b;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ProfilePhotoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 2px solid #e2e8f0;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PhotoPreview = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 60px;
  font-weight: bold;
  flex-shrink: 0;
`;

const PhotoUploadBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileInput = styled.input`
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;

  &::file-selector-button {
    padding: 8px 16px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    margin-right: 10px;

    &:hover {
      background: #1d4ed8;
    }
  }
`;

const FileHelp = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${({ $primary }) =>
    $primary
      ? `
    background: #2563eb;
    color: white;

    &:hover {
      background: #1d4ed8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    &:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
      transform: none;
    }
  `
      : `
    background: transparent;
    color: #2563eb;
    border: 1px solid #2563eb;

    &:hover {
      background: #f0f9ff;
    }
  `}
`;

const Alert = styled.div`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;

  ${({ $type }) =>
    $type === "error"
      ? `
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `
      : `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setProfileData({
      full_name: currentUser.full_name || "",
      email: currentUser.email || "",
      bio: currentUser.bio || "",
    });
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Convert field names to camelCase for backend
      const dataToSend = {
        fullName: profileData.full_name,
        bio: profileData.bio,
      };

      await authAPI.updateProfile(dataToSend);

      // Upload profile photo if selected
      if (profilePhoto) {
        const formData = new FormData();
        formData.append("file", profilePhoto);
        await authAPI.uploadProfilePhoto(formData);
      }

      setSuccess("Profile updated successfully!");

      // Update stored user with snake_case field names
      const updatedUser = {
        ...user,
        full_name: profileData.full_name,
        bio: profileData.bio,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Reset photo state after successful upload
      setProfilePhoto(null);
      setPhotoPreview(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <PageContainer>Loading...</PageContainer>;
  }

  const userInitial = user.full_name?.[0]?.toUpperCase() || "U";

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>Account Settings</Title>
          <Subtitle>Manage your profile and account preferences</Subtitle>
        </Header>

        {error && <Alert $type="error">{error}</Alert>}
        {success && <Alert $type="success">{success}</Alert>}

        {/* Profile Information */}
        <Card>
          <CardTitle>Profile Information</CardTitle>

          <ProfilePhotoSection>
            <PhotoPreview>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                userInitial
              )}
            </PhotoPreview>
            <PhotoUploadBox>
              <Label>Profile Photo</Label>
              <FileInput
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <FileHelp>
                Upload a profile picture (JPG, PNG, up to 5MB)
              </FileHelp>
            </PhotoUploadBox>
          </ProfilePhotoSection>

          <form onSubmit={handleUpdateProfile}>
            <FormRow>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleProfileChange}
                  placeholder="Your full name"
                />
              </FormGroup>
              <FormGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="your.email@example.com"
                  disabled
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Bio</Label>
              <TextArea
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="Tell us about yourself (optional)"
              />
            </FormGroup>

            <ButtonGroup>
              <Button type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button $primary type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </ButtonGroup>
          </form>
        </Card>

        {/* Change Password */}
        <Card>
          <CardTitle>Change Password</CardTitle>

          <form onSubmit={handleUpdatePassword}>
            <FormGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>New Password</Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </FormGroup>
            </FormRow>

            <ButtonGroup>
              <Button
                type="button"
                onClick={() =>
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })
                }
              >
                Clear
              </Button>
              <Button $primary type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner /> Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </ButtonGroup>
          </form>
        </Card>

        {/* Account Information */}
        <Card>
          <CardTitle>Account Information</CardTitle>

          <FormGroup>
            <Label>User Role</Label>
            <Input
              type="text"
              value={user.role?.toUpperCase() || "N/A"}
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>Member Since</Label>
            <Input
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>Account Status</Label>
            <Input
              type="text"
              value={user.is_active ? "Active" : "Inactive"}
              disabled
            />
          </FormGroup>
        </Card>
      </Container>
    </PageContainer>
  );
};

export default ProfilePage;
