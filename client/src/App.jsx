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
import {
  connectSocket,
  listenForForceLogout,
  disconnectSocket,
} from "./socket";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerification from "./pages/OTPVerification";
import OTPSend from "./pages/OTPSend";
import RegisterOTPSend from "./pages/RegisterOTPSend";
import VerifyOTP from "./pages/VerifyOTP";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import VerifyPayment from "./../src/components/Payment/VerifyPayment";
import GetCertified from "./components/course details/GetCertified";

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
    window.scroll(0, 0);

    if (token && userId) {
      // Connect socket and register user
      connectSocket(userId);

      // Listen for force logout events (like when admin blocks user)
      listenForForceLogout((data) => {
        toast.error(data.message || "You have been logged out");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        if (data.reason === "blocked") {
          navigate("/login?blocked=true", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
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
        {/* Public routes with layout */}
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

        {/* Authentication flow routes */}
        <Route
          path="/forgot-password"
          element={
            <MainLayout>
              <ForgotPassword />
            </MainLayout>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <MainLayout>
              <OTPVerification />
            </MainLayout>
          }
        />
        <Route
          path="/send-otp"
          element={
            <MainLayout>
              <OTPSend />
            </MainLayout>
          }
        />
        <Route
          path="/get-certified/:courseId/:studentId"
          element={
            <MainLayout>
              <GetCertified />
            </MainLayout>
          }
        />

        {/* Registration-specific OTP routes */}
        <Route
          path="/signup/send-otp-Registration"
          element={
            <MainLayout>
              <RegisterOTPSend />
            </MainLayout>
          }
        />
        <Route
          path="/signup/verify-otp"
          element={
            <MainLayout>
              <VerifyOTP />
            </MainLayout>
          }
        />

        {/* Instructor approval */}
        <Route
          path="/pending-approval"
          element={
            <MainLayout>
              <PendingApproval />
            </MainLayout>
          }
        />

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
        <Route path="/verify-payment/:tx_ref" element={<VerifyPayment />} />

        {/* Protected routes without layout */}
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
