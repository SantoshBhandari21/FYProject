import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
`;

const Card = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
`;

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  }, [navigate]);

  return (
    <Page>
      <Card>You have been logged out.</Card>
    </Page>
  );
};

export default LogoutPage;
