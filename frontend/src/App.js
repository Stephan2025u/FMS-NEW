import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ClientProfile from "./components/ClientProfile";
import FMSTest from "./components/FMSTest";
import TestResults from "./components/TestResults";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/client/:clientId" element={<ClientProfile />} />
          <Route path="/test/:clientId" element={<FMSTest />} />
          <Route path="/results/:testId" element={<TestResults />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;