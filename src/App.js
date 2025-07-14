// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoggerProvider from "./components/LoggerProvider";
import UrlShortenerForm from "./components/UrlShortenerForm";
import StatsPage from "./components/StatsPage";
import RedirectHandler from "./components/RedirectHandler";
import AppShell from "./components/AppShell";

function App() {
  return (
    <LoggerProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<UrlShortenerForm />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/:shortcode" element={<RedirectHandler />} />
          </Routes>
        </AppShell>
      </Router>
    </LoggerProvider>
  );
}

export default App;