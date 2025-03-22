import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setIsLoading(true);

    // Simulate a signup API call
    setTimeout(() => {
      alert("Account created successfully");
      setIsLoading(false);
      // Redirect to login page or handle further actions here
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create an account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Fidel Hub and start your learning journey today
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 md:p-8 shadow-lg"
          >
            <div className="mb-6">
              <div className="flex justify-center space-x-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {["student", "instructor"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200",
                      role === r
                        ? "bg-white dark:bg-slate-900 text-fidel-600 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                    type="button"
                    disabled={isLoading}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="glass-input pl-10"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="glass-input pl-10"
                    placeholder="your.email@example.com"
                    disabled={isLoading}
                  />
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="glass-input pl-10 pr-10"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="glass-input pl-10"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-fidel-600 focus:ring-fidel-500"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                  I agree to the <Link to="/terms" className="text-fidel-600 hover:text-fidel-500 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-fidel-600 hover:text-fidel-500 font-medium">Privacy Policy</Link>
                </label>
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-fidel-500 hover:bg-fidel-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-900 text-muted-foreground">Or sign up with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button 
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Google
                </button>
                <button 
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Microsoft
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-fidel-600 hover:text-fidel-500 font-medium">
              Sign in
            </Link>
          </motion.p>
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Signup;
