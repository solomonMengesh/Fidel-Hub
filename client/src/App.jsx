import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
const App = () => {
  return (
    <Router>
      <Routes>
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
         <Route path="/" element={<Index />} />
         <Route path="/courses" element={<Courses />} />
         <Route path="/courses/:courseId" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
};
//       );
//     }

export default App;
