import { useState } from "react";
import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ui/ThemeToggle";
import io from 'socket.io-client';
 import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import axios from "axios";
import { toast } from "sonner";
import { useSearchParams } from 'react-router-dom';

const socket = io(import.meta.env.VITE_API_BASE_URL); 

const Login = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    if (searchParams.get('blocked') === 'true') {
      toast.error('Your account has been blocked by the administrator');
      // Clear the query param after showing the message
      window.history.replaceState(null, '', '/login');
    }
  }, [searchParams]);

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Use the login function from AuthContext instead of direct axios call
    const response = await login(email, password);
    if (!response || !response.token || !response.user) {
      throw new Error("Invalid login response");
    }

    // Successful login
    toast.success("Login Successful! Redirecting to your dashboard...");

    // Store token if using JWT
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));  //
    }
    // if (checkTokenExpiry()) {
    //   localStorage.removeItem("token");
    //   navigate("/login");  
    //   return;
    // }
    // Get user details - now from response directly (not response.data)
    const { role: userRole, isApproved, status, _id} = response.user || {};

    console.log("Login response:", { userRole, isApproved, status });

    socket.emit('userConnected', _id);
        if (status === "blocked") {
      toast.error("Your account has been blocked by the admin.");
      localStorage.removeItem("token"); // Remove token if stored
      setIsLoading(false);
      return; 
    }
    // Determine redirect path
    let redirectPath = "/";
    if (!isApproved) {
      redirectPath = "/pending-approval";
    } else {
      switch (userRole) {
        case "instructor":
          redirectPath = "/instructor-dashboard";
          break;
        case "admin":
          redirectPath = "/admin-dashboard";
          break;
        case "student":
        default:
          redirectPath = "/";
      }
    }

    // Navigate without delay since context is already updated
    navigate(redirectPath, { 
      replace: true,
      state: { freshLogin: true }
    });

  } catch (error) {
    let errorMessage = "Login failed. Please try again.";
  
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid email or password";
            break;
          case 403:
            const { message } = error.response.data;
  
            // Check for blocked or pending approval status in the response message
            if (message?.includes("blocked")) {
              errorMessage = "Your account has been blocked by the admin.";
            } else if (message?.includes("approved")) {
              errorMessage = "Your account is pending approval by an admin.";
            } else if (message?.includes("not verified")) {
              errorMessage = "Account not verified. Please check your email.";
            } else {
              errorMessage = message || "Account not verified.";
            }
            break;
          case 404:
            errorMessage = "User not found";
            break;
          case 429:
            errorMessage = "Too many attempts. Please try again later.";
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
    }
  
    toast.error(errorMessage);
    console.error("Login error:", error);
  }
   finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-fidel-100 dark:bg-fidel-950/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-slate-100 dark:bg-slate-800/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>

        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue your learning journey
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 md:p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-input"
                  placeholder="your.email@example.com"
                />
                
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="glass-input pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-fidel-600 focus:ring-fidel-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="text-fidel-600 hover:text-fidel-500 font-medium">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-fidel-500 hover:bg-fidel-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : "Sign in"}
                </Button>
              </div>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-center text-sm text-muted-foreground"
            >
              Don't have an account?{" "}
              <Link to="/signup" className="text-fidel-600 hover:text-fidel-500 font-medium">
                Sign up for free
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Login;