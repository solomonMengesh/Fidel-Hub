import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { UserPlus, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const RegisterOTPSend = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Enhanced registration data handling
    const registrationData = location.state?.registrationData || {};

    useEffect(() => {
        console.log('Registration data:', registrationData); // Debug log
        
        if (registrationData.email) {
            setEmail(registrationData.email);
        } else {
            // If no registration data, redirect with proper path
            navigate('/signup', { 
                replace: true,
                state: { 
                    error: 'Please complete registration first' 
                }
            });
        }
    }, [registrationData, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            const response = await fetch('http://localhost:5000/api/otp/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
    
            const data = await response.json();
            console.log("API Response:", data);
    
            // Check for the message field or success status directly
            if (data.message === 'OTP sent successfully') {
                // ✅ Show success toast
                toast.success(data.message || `OTP sent to ${email}`);
    
                // ✅ Then navigate to the verification page
                navigate('/signup/verify-otp', {
                    state: {
                        email,
                        registrationData: {
                            ...registrationData,
                            email,
                        },
                        timestamp: new Date().getTime(),
                    },
                });
                console.log("Navigating to /signup/verify-otp");  // Debug log to confirm
            } else {
                // ❌ Show error toast if the message is unexpected
                toast.error(data.message || "Could not send OTP");
            }
        } catch (error) {
            toast.error(error.message || "Could not send OTP");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    
    return (
        <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/">
                        <h1 className="text-3xl font-bold text-gray-900">Fidel-Hub</h1>
                    </Link>
                </div>
                
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center mb-6">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <UserPlus className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="mt-3 text-xl font-semibold">Verify Your Account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We'll send a verification code to your email
                        </p>
                    </div>
                    
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly={!!registrationData?.email}
                                className={registrationData?.email ? "bg-gray-100" : ""}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Verification'}
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => navigate('/signup')}
                            type="button"
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Registration
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterOTPSend;
