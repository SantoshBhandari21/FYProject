// src/pages/AboutPage.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #f1f5f9;
  padding: 32px 16px;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.06);
`;

const Title = styled.h1`
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 28px;
  font-weight: 900;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  color: #475569;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBox = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: #f8fafc;
`;

const BoxTitle = styled.h3`
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 16px;
  font-weight: 900;
`;

const BoxText = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.5;
  font-size: 14px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 800;
  border: 1px solid #2563eb;
  color: #2563eb;
  background: transparent;

  &:hover {
    background: #2563eb;
    color: #ffffff;
  }
`;

const Primary = styled(Link)`
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 900;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;

  &:hover {
    background: #1e40af;
    border-color: #1e40af;
  }
`;

const AboutPage = () => {
  return (
    <Page>
      <Container>
        <Card>
          <Title>About Us</Title>
          <Sub>
            myRentals is a simple room rental platform made for tenants and owners.
            Tenants can browse rooms, filter by location and price, and book instantly
            (minimum 1 month). Owners can list and manage rooms, and admins can monitor listings.
          </Sub>

          <Grid>
            <InfoBox>
              <BoxTitle>What we do</BoxTitle>
              <BoxText>
                We connect room owners and tenants with an easy-to-use system for browsing
                and booking individual rooms.
              </BoxText>
            </InfoBox>

            <InfoBox>
              <BoxTitle>How booking works</BoxTitle>
              <BoxText>
                Booking is instant. Tenants pay 1 month rent fee and receive an auto-generated invoice.
              </BoxText>
            </InfoBox>

            <InfoBox>
              <BoxTitle>Trust & reviews</BoxTitle>
              <BoxText>
                Only tenants who booked a room can leave a review. This helps keep reviews genuine.
              </BoxText>
            </InfoBox>
          </Grid>

          <ButtonRow>
            <Primary to="/browse">Browse Rooms</Primary>
            <Button to="/contact">Contact Us</Button>
          </ButtonRow>
        </Card>
      </Container>
    </Page>
  );
};

export default AboutPage;