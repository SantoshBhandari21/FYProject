// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 64px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1e293b;
  font-weight: 600;
  font-size: 24px;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const LogoIcon = styled.span`
  font-size: 28px;
  margin-right: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-right: 6px;
  }
`;

const LogoText = styled.span`
  color: #2563eb;

  @media (max-width: 480px) {
    display: none;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 14px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #2563eb;
    background-color: #f8fafc;
  }

  &.active {
    color: #2563eb;
    background-color: #eff6ff;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Button = styled(Link)`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &.outline {
    background: transparent;
    color: #2563eb;
    border: 1px solid #2563eb;

    &:hover {
      background: #2563eb;
      color: white;
      transform: translateY(-1px);
    }
  }

  &.primary {
    background: #2563eb;
    color: white;
    border: 1px solid #2563eb;

    &:hover {
      background: #1d4ed8;
      border-color: #1d4ed8;
      transform: translateY(-1px);
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const HamburgerIcon = styled.div`
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: #1e293b;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &.open span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }
  &.open span:nth-child(2) {
    opacity: 0;
  }
  &.open span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }
`;

const MobileMenu = styled.div`
  display: none;
  background-color: white;
  border-top: 1px solid #e2e8f0;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;

  &.open {
    max-height: 520px;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuContent = styled.div`
  padding: 20px 24px;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const MobileNavLink = styled(Link)`
  padding: 12px 16px;
  border-radius: 6px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
    color: #2563eb;
  }

  &.active {
    background-color: #2563eb;
    color: white;
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MobileButton = styled(Link)`
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: center;

  &.outline {
    background: transparent;
    color: #2563eb;
    border: 1px solid #2563eb;

    &:hover {
      background: #2563eb;
      color: white;
    }
  }

  &.primary {
    background: #2563eb;
    color: white;
    border: 1px solid #2563eb;

    &:hover {
      background: #1d4ed8;
      border-color: #1d4ed8;
    }
  }
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Keep placeholders (your core logic stays same)
  const user = null;
  const userType = null; // 'landlord' or 'tenant'

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Logo to="/">
          <LogoIcon>🏠</LogoIcon>
          <LogoText>myRentals</LogoText>
        </Logo>

        <DesktopNav>
          <NavLink to="/" className={isActive("/")}>Home</NavLink>
          <NavLink to="/browse" className={isActive("/browse")}>Browse Rooms</NavLink>
          <NavLink to="/about" className={isActive("/about")}>About</NavLink>
          <NavLink to="/contact" className={isActive("/contact")}>Contact</NavLink>

          {user && userType === "landlord" && (
            <>
              <NavLink
                to="/landlord/dashboard"
                className={location.pathname.startsWith("/landlord") ? "active" : ""}
              >
                Dashboard
              </NavLink>
              <NavLink to="/landlord/add-room" className={isActive("/landlord/add-room")}>
                Add Room
              </NavLink>
            </>
          )}

          {user && userType === "tenant" && (
            <NavLink
              to="/tenant/dashboard"
              className={location.pathname.startsWith("/tenant") ? "active" : ""}
            >
              Dashboard
            </NavLink>
          )}
        </DesktopNav>

        <NavActions>
          {!user ? (
            <>
              <Button to="/login" className="outline">Login</Button>
              <Button to="/register" className="primary">Sign Up</Button>
            </>
          ) : (
            <>
              <Button to="/profile" className="outline">Profile</Button>
              <Button to="/logout" className="outline">Logout</Button>
            </>
          )}
        </NavActions>

        <MobileMenuButton onClick={() => setIsMobileMenuOpen((s) => !s)}>
          <HamburgerIcon className={isMobileMenuOpen ? "open" : ""}>
            <span />
            <span />
            <span />
          </HamburgerIcon>
        </MobileMenuButton>
      </HeaderContainer>

      <MobileMenu className={isMobileMenuOpen ? "open" : ""}>
        <MobileMenuContent>
          <MobileNavLinks>
            <MobileNavLink to="/" className={isActive("/")} onClick={closeMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/browse" className={isActive("/browse")} onClick={closeMenu}>
              Browse Rooms
            </MobileNavLink>
            <MobileNavLink to="/about" className={isActive("/about")} onClick={closeMenu}>
              About
            </MobileNavLink>
            <MobileNavLink to="/contact" className={isActive("/contact")} onClick={closeMenu}>
              Contact
            </MobileNavLink>

            {user && userType === "landlord" && (
              <>
                <MobileNavLink
                  to="/landlord/dashboard"
                  className={location.pathname.startsWith("/landlord") ? "active" : ""}
                  onClick={closeMenu}
                >
                  Dashboard
                </MobileNavLink>
                <MobileNavLink
                  to="/landlord/add-room"
                  className={isActive("/landlord/add-room")}
                  onClick={closeMenu}
                >
                  Add Room
                </MobileNavLink>
              </>
            )}

            {user && userType === "tenant" && (
              <MobileNavLink
                to="/tenant/dashboard"
                className={location.pathname.startsWith("/tenant") ? "active" : ""}
                onClick={closeMenu}
              >
                Dashboard
              </MobileNavLink>
            )}
          </MobileNavLinks>

          <MobileActions>
            {!user ? (
              <>
                <MobileButton to="/login" className="outline" onClick={closeMenu}>
                  Login
                </MobileButton>
                <MobileButton to="/register" className="primary" onClick={closeMenu}>
                  Sign Up
                </MobileButton>
              </>
            ) : (
              <>
                <MobileButton to="/profile" className="outline" onClick={closeMenu}>
                  Profile
                </MobileButton>
                <MobileButton to="/logout" className="outline" onClick={closeMenu}>
                  Logout
                </MobileButton>
              </>
            )}
          </MobileActions>
        </MobileMenuContent>
      </MobileMenu>
    </HeaderWrapper>
  );
};

export default Header;
