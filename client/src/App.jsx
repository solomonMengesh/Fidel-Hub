import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import UserDetails from "./pages/Userdetails";
import { Toaster } from "./components/ui/sonner";
import { toast } from "react-toastify";
import { connectSocket, listenForForceLogout, disconnectSocket } from "./socket";
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      // Connect socket and register user
      connectSocket(userId);
      
      // Listen for force logout events (like when admin blocks user)
      listenForForceLogout((data) => {
        // Show error message
        toast.error(data.message || "You have been logged out");
        
        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        
        // Redirect to login with blocked state
        if (data.reason === "blocked") {
          navigate("/login?blocked=true", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
        
        // Force page reload to clear any sensitive data
        window.location.reload();
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [navigate]);

  return (
    <>
      <Routes>
        {/* Routes with Navbar and Footer */}
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
    </>
  );
};

export default App;
