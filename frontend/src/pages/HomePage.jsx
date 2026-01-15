// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const HomePageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  width: 100%;
  background: linear-gradient(135deg, #d3daebff 0%, #bec8d6ff 100%);
  color: #0f172a;
  padding: 80px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'><path d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(255,255,255,0.35)' stroke-width='1'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)' /></svg>");
    opacity: 0.35;
  }

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 860px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 18px;
  line-height: 1.15;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  margin-bottom: 36px;
  opacity: 0.95;
  line-height: 1.6;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 28px;
  }
`;

const SearchForm = styled.form`
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.55);
`;

const SearchInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
    border-color: rgba(37, 99, 235, 0.35);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const SearchButton = styled.button`
  padding: 14px 22px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
  }
`;

const QuickLinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const QuickLink = styled(Link)`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.25);
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.45);
    border-color: rgba(37, 99, 235, 0.35);
  }
`;

const FeaturesSection = styled.section`
  width: 100%;
  padding: 70px 0;
  background: white;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 34px;
  margin-bottom: 44px;
  color: #0f172a;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 32px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 26px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(2, 6, 23, 0.08);
    border-color: rgba(37, 99, 235, 0.35);
  }
`;

const FeatureIcon = styled.div`
  font-size: 44px;
  margin-bottom: 14px;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #0f172a;
  font-weight: 800;
`;

const FeatureDescription = styled.p`
  color: #475569;
  line-height: 1.6;
  font-size: 14px;
`;

const CTASection = styled.section`
  width: 100%;
  padding: 70px 0;
  background: #f8fafc;
`;

const CTAGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CTACard = styled.div`
  background: white;
  padding: 34px;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(2, 6, 23, 0.06);
  border: 1px solid #e2e8f0;
  text-align: center;
`;

const CTATitle = styled.h3`
  font-size: 22px;
  margin-bottom: 12px;
  color: #2563eb;
  font-weight: 800;
`;

const CTADescription = styled.p`
  margin-bottom: 22px;
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
`;

const CTAButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled(Link)`
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: center;

  &.primary {
    background: #2563eb;
    color: white;
    border: 2px solid #2563eb;

    &:hover {
      background: #1e40af;
      border-color: #1e40af;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: transparent;
    color: #2563eb;
    border: 2px solid #2563eb;

    &:hover {
      background: #2563eb;
      color: white;
      transform: translateY(-1px);
    }
  }
`;

const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchLocation.trim()) params.append("location", searchLocation.trim());
    if (maxPrice.trim()) params.append("maxPrice", maxPrice.trim());

    navigate(`/browse?${params.toString()}`);
  };

  return (
    <HomePageWrapper>
      <HeroSection>
        <Container>
          <HeroContent>
            <HeroTitle>Find Your Perfect Room</HeroTitle>
            <HeroSubtitle>
              Browse rooms, filter by location and price, and book securely in minutes.
            </HeroSubtitle>

            <SearchForm onSubmit={handleSearch}>
              <SearchInputGroup>
                <SearchInput
                  type="text"
                  placeholder="Enter location (e.g., Kathmandu)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
                <SearchInput
                  type="number"
                  placeholder="Max price per month"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
                <SearchButton type="submit">Search Rooms</SearchButton>
              </SearchInputGroup>
            </SearchForm>

            <QuickLinkContainer>
              <QuickLink to="/browse">Browse All Rooms</QuickLink>
              <QuickLink to="/login">Login</QuickLink>
              <QuickLink to="/register?type=tenant">Sign Up</QuickLink>
            </QuickLinkContainer>
          </HeroContent>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <SectionTitle>Why Choose myRentals?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureTitle>Easy Search</FeatureTitle>
              <FeatureDescription>
                Filter rooms by location, price, and availability.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>✅</FeatureIcon>
              <FeatureTitle>Trusted Listings</FeatureTitle>
              <FeatureDescription>
                Owners manage accurate details and photos for each listing.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>💳</FeatureIcon>
              <FeatureTitle>Secure Payments</FeatureTitle>
              <FeatureDescription>
                Pay via eSewa and track payment status and invoices.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📄</FeatureIcon>
              <FeatureTitle>Invoices</FeatureTitle>
              <FeatureDescription>
                Auto-generated invoices for every booking and payment.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      <CTASection>
        <Container>
          <CTAGrid>
            <CTACard>
              <CTATitle>Looking for a Room?</CTATitle>
              <CTADescription>
                Browse available rooms and book for at least one month.
              </CTADescription>
              <CTAButtonGroup>
                <CTAButton to="/browse" className="primary">
                  Browse Rooms
                </CTAButton>
                <CTAButton to="/register?type=tenant" className="secondary">
                  Sign Up as Tenant
                </CTAButton>
              </CTAButtonGroup>
            </CTACard>

            <CTACard>
              <CTATitle>Have a Room to Rent?</CTATitle>
              <CTADescription>
                Create an owner account and start listing rooms in minutes.
              </CTADescription>
              <CTAButtonGroup>
                <CTAButton to="/register?type=owner" className="primary">
                  List Your Room
                </CTAButton>
                <CTAButton to="/login" className="secondary">
                  Owner Login
                </CTAButton>
              </CTAButtonGroup>
            </CTACard>
          </CTAGrid>
        </Container>
      </CTASection>
    </HomePageWrapper>
  );
};

export default HomePage;
