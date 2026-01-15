/*
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Import components and styles
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import LogoutPage from './pages/LogoutPage';


// Auth Context
import { AuthProvider } from './hooks/useAuth.jsx';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #3f4449ff;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <GlobalStyles />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<ClientDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route 
              path="*" 
              element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } 
            />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
*/
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import LogoutPage from './pages/LogoutPage';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
