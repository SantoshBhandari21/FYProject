// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";

// Import components and styles
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import BrowseRooms from "./pages/BrowseRooms";
import LogoutPage from "./pages/LogoutPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";


// Auth Context
import { AuthProvider } from "./hooks/useAuth.jsx";

const AppShell = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell>
          <GlobalStyles />
          <Header />

          <Main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignUpPage />} />
              <Route path="/browse" element={<BrowseRooms />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />


              <Route
                path="*"
                element={
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                }
              />
            </Routes>
          </Main>
        </AppShell>
      </Router>
    </AuthProvider>
  );
}

export default App;
