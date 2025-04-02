import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PendingApproval from "./components/instructor/PendingApproval";
import { Toaster } from "@/components/ui/sonner";
import UserDetails from "./pages/Userdetails";

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes that include Navbar and Footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Index />
            </MainLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <MainLayout>
              <Courses />
            </MainLayout>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <MainLayout>
              <CourseDetails />
            </MainLayout>
          }
        />
        <Route
          path="/pending-approval"
          element={
            <MainLayout>
              <PendingApproval />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <MainLayout>
              <Signup />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />

        {/* Routes without Navbar and Footer */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:userId" element={<UserDetails />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
