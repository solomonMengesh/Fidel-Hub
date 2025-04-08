import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const { email, registrationData, timestamp } = location.state || {};

    useEffect(() => {
        if (!email || !registrationData) {
            navigate('/signup', { replace: true });
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => (prev <= 1 ? (clearInterval(timer), setResendDisabled(false), 0) : prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [email, registrationData, navigate]);

    const handleOtpChange = (index, value) => {
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');

        if (fullOtp.length !== 6) {
            toast({
                title: "Incomplete Code",
                description: "Please enter all 6 digits",
                variant: "destructive",
            });
            return;
        }

        setIsVerifying(true);

        try {
            // Simulate API verification
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // On successful verification
            toast({
                title: "Account Verified!",
                description: "Your account has been successfully created",
            });

            // Navigate to login page with success state
            navigate('/login', {
                state: {
                    registrationSuccess: true,
                    verifiedEmail: email,
                    from: 'registration'
                },
                replace: true
            });

        } catch (error) {
            toast({
                title: "Verification Failed",
                description: error.message || "Invalid verification code",
                variant: "destructive",
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        setResendDisabled(true);
        setCountdown(60);
        
        try {
            // Simulate resend API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            toast({
                title: "New Code Sent",
                description: `A new verification code has been sent to ${email}`,
            });
        } catch (error) {
            toast({
                title: "Resend Failed",
                description: error.message || "Please try again later",
                variant: "destructive",
            });
            setResendDisabled(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Fidel-Hub</h1>
                </div>
                
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold">Enter Verification Code</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sent to <span className="font-medium">{email}</span>
                        </p>
                    </div>
                    
                    <form className="space-y-4" onSubmit={handleVerify}>
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    className="w-12 h-12 text-center text-xl"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isVerifying || otp.join('').length !== 6}
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : 'Verify Account'}
                        </Button>

                        <div className="text-center text-sm">
                            <Button
                                variant="link"
                                onClick={handleResendOTP}
                                disabled={resendDisabled}
                                className="text-gray-600"
                            >
                                Resend Code {resendDisabled && `(${countdown}s)`}
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={() => navigate('/signup/send-otp-Registration', { state: { registrationData } })}
                            type="button"
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Email Verification
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;