import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import axios from 'axios';  // Import Axios for API call

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Make API call to send OTP for password reset
      const response = await axios.post('http://localhost:5000/api/otp/request-password-reset', { email });

      if (response.status === 200) {
        // Navigate to OTP verification page with context for password reset
        navigate('/verify-otp', { 
          state: { 
            email, 
            isPasswordReset: true 
          }
        });

        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to send verification code",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error("Error sending OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Fidel-Hub
          </h2>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and we'll send you a verification code to reset your password.
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-sm"
              >
                Back to Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
