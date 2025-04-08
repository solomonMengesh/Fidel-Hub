import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, UserPlus } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';

const OTPVerification = ({
  email,
  onSuccess,
  onBack,
  isPasswordReset = false,
  isRegistration = false,
}) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleResendOTP = async () => {
    try {
      setIsSending(true);
      await axios.post('http://localhost:5000/api/otp/send-otp', { email });
      toast({
        title: "OTP Sent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const route = isRegistration 
        ? 'http://localhost:5000/api/otp/verify-otp' 
        : 'http://localhost:5000/api/otp/verify-password-reset-otp';

      const response = await axios.post(route, {
        email,
        otp,
      });

      if (response.data.success || response.data.message.includes('verified successfully')) {
        toast.success("OTP verified successfully");
        if (isRegistration) {
          // If it's registration, you can handle registration completion
          onSuccess();
        } else {
          setShowPasswordForm(true);
        }
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while verifying the OTP.");
      setShowPasswordForm(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/otp/reset-password', {
        email,
        otp,
        newPassword: password,
      });

      toast.success("Password reset successfully");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while resetting the password.");
    }
  };

  if (showPasswordForm && isPasswordReset) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Create New Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter and confirm your new password
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700">
              Show Password
            </label>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Button 
            onClick={handleResetPassword} 
            className="w-full"
          >
            Reset Password
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          {isRegistration ? (
            <UserPlus className="h-6 w-6 text-blue-600" />
          ) : (
            <Lock className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <h2 className="mt-4 text-xl font-semibold">
          {isRegistration ? "Complete Registration" : "Verification Required"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a 6-digit verification code to<br />
          <strong>{email}</strong>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex flex-col space-y-3">
        <Button 
          onClick={handleVerifyOTP} 
          disabled={otp.length !== 6 || isVerifying}
          className="w-full"
        >
          {isVerifying ? "Verifying..." : isRegistration ? "Verify & Complete Registration" : "Verify OTP"}
        </Button>
        
        <div className="flex justify-center text-sm">
          <button
            className="text-blue-600"
            onClick={handleResendOTP}
            disabled={isSending}
          >
            {isSending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
