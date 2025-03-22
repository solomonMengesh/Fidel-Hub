import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
 
const App = () => {
  return (
    <Router>
      <Routes>
         <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
