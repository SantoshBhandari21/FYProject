import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  padding: 16px 32px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Brand = styled.h3`
  margin: 0;
  color: #111827;
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
  const user = localStorage.getItem('user');

  return (
    <Nav>
      <Brand>myRentals</Brand>

      <NavLinks>
        {user ? (
          <NavButton onClick={() => navigate('/logout')}>
            Logout
          </NavButton>
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
