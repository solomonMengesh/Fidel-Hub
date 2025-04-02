import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ui/ThemeToggle";
// import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { toast } from "sonner";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          email,
          password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true // For cookies if using them
        }
      );
    
      // Successful login
      toast.success("Login Successful! Redirecting to your dashboard...");
    
      // Store the token if using JWT
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
    
      // Get the user role from the response
      const userRole = response.data.user?.role;
    
      // Redirect based on the user role
      let redirectPath = "/"; // Default path in case the role is unknown
    
      if (userRole === "instructor") {
        redirectPath = "/instructor-dashboard";
      } else if (userRole === "student") {
        redirectPath = "/";
      } else if (userRole === "admin") {
        redirectPath = "/admin-dashboard";
      }
    
      // Redirect to the appropriate dashboard
      navigate(redirectPath);
    
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMessage = "Invalid email or password";
              toast.error("Invalid email or password");
              break;
            case 403:
              errorMessage = "Account not verified. Please check your email.";
              toast.error("Your account is pending approval by an admin.");
              break;
            case 404:
              errorMessage = "User not found";
              toast.error("User not found");
              break;
            default:
              errorMessage = error.response.data.message || errorMessage;
          }
        }
      }
      console.log("Login Failed:", errorMessage);
      // toast.error("Login failed", { 
      //   description: error instanceof Error ? error.message : "An unknown error occurred"
      // });
      
      
    } finally {
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