import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 40px 24px;
`;

const Form = styled.form`
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: verify with backend
    console.log({ email, password, role });

    // Redirect based on role
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'owner') navigate('/owner/dashboard');
    else navigate('/client/dashboard');
  };

  return (
    <Wrapper>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <Button type="submit">Login</Button>
      </Form>
    </Wrapper>
  );
};

export default LoginPage;


/*
import React, { useState } from 'react';
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
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #111827;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #9ca3af;
  font-size: 14px;
  background: #f9fafb;
  color: #111827;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
  }

  &:hover {
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #9ca3af;
  font-size: 14px;
  background: #f9fafb;
  color: #111827;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
  }

  &:hover {
    border-color: #2563eb;
  }
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: #1e40af;
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP login logic (replace with backend later)
    console.log({ email, password, role });

    // ✅ Store user info for Navbar & auth check
    localStorage.setItem('user', JSON.stringify({ role }));

    // Redirect based on role
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'owner') navigate('/owner/dashboard');
    else navigate('/client/dashboard');
  };

  return (
    <Page>
      <Card>
        <Title>Login to Your Account</Title>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">Tenant</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </Select>

          <Button type="submit">Login</Button>
        </Form>
      </Card>
    </Page>
  );
};

export default LoginPage;
*/