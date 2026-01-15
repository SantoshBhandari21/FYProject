
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

const Select = styled.select`
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

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send data to backend
    console.log({ name, email, password, role });
    navigate('/login');
  };

  return (
    <Wrapper>
      <h2>Create an Account</h2>
      <Form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
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
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </Select>
        <Button type="submit">Sign Up</Button>
      </Form>
    </Wrapper>
  );
};

export default SignUpPage;

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

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: send data to backend
    console.log({ name, email, password, role });

    navigate('/login');
  };

  return (
    <Page>
      <Card>
        <Title>Create an Account</Title>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <Button type="submit">Sign Up</Button>
        </Form>
      </Card>
    </Page>
  );
};

export default SignUpPage;*/
