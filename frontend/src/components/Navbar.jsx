import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  padding: 12px 32px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const BrandContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoImg = styled.img`
  height: 60px;
  width: 60px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: 45px;
    width: 45px;
  }
`;

const Brand = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 22px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #2563eb;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  return (
    <Nav>
      <BrandContainer to="/">
        <LogoImg src="./myLogo.png" alt="myRentals Logo" />
        <Brand>myRentals</Brand>
      </BrandContainer>

      <NavLinks>
        {user ? (
          <>
            {user.role === "tenant" && (
              <NavLink to="/tenant/dashboard">Dashboard</NavLink>
            )}
            <NavButton onClick={() => navigate("/logout")}>Logout</NavButton>
          </>
        ) : (
          <>
            <NavLink to="/BrowseRooms">Login</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
