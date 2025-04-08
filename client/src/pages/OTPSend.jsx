import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, UserPlus } from 'lucide-react';

const OTPSend = () => {
    const [contactMethod, setContactMethod] = useState('email');
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    
    // Get flow type from location state (registration, login, password-reset)
    const flowType = location.state?.flowType || 'login';
    // Get registration data if coming from registration
    const registrationData = location.state?.registrationData;

    // Log the received location.state data for debugging
    useEffect(() => {
        console.log('Received data from previous page:', location.state);
        
        // Check if we have registration data with email or phone
        if (registrationData) {
            console.log('Processing registration data:', registrationData);
            
            // Prioritize email if both exist
            if (registrationData.email) {
                console.log('Setting email:', registrationData.email);
                setEmailOrPhone(registrationData.email);
                setContactMethod('email');
            } else if (registrationData.phone) {
                console.log('Setting phone:', registrationData.phone);
                setEmailOrPhone(registrationData.phone);
                setContactMethod('phone');
            }
        }
    }, [registrationData]); // Only depend on registrationData

    // Set page title and description based on flow type
    let pageTitle, pageDescription;
    
    switch(flowType) {
        case 'registration':
            pageTitle = "Verify Your Account";
            pageDescription = "Please verify your contact information to complete registration";
            break;
        case 'password-reset':
            pageTitle = "Reset Password";
            pageDescription = "Enter your contact information to reset your password";
            break;
        default: // login or other
            pageTitle = "Verification Code";
            pageDescription = "Enter your contact information to receive a verification code";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!emailOrPhone.trim()) {
            toast({
                title: "Error",
                description: `Please enter your ${contactMethod}.`,
                variant: "destructive",
            });
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Simulate sending OTP (replace with actual implementation)
            console.log(`Sending OTP to ${emailOrPhone}`);
            
            // Navigate to OTP verification page with appropriate state data
            navigate('/verify-otp', { 
                state: { 
                    email: contactMethod === 'email' ? emailOrPhone : '',
                    phone: contactMethod === 'phone' ? emailOrPhone : '',
                    flowType,
                    registrationData: flowType === 'registration' ? registrationData : undefined,
                    from: location.state?.from
                }
            });
            
            toast({
                title: "Verification Code Sent",
                description: `Please check your ${contactMethod} for the verification code.`,
            });
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

    const handleBackClick = () => {
        if (flowType === 'registration') {
            navigate('/register');
        } else if (flowType === 'password-reset') {
            navigate('/forgot-password');
        } else {
            navigate('/login');
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
                            {flowType === 'registration' ? (
                                <UserPlus className="h-6 w-6 text-blue-600" />
                            ) : contactMethod === 'email' ? (
                                <Mail className="h-6 w-6 text-blue-600" />
                            ) : (
                                <Phone className="h-6 w-6 text-blue-600" />
                            )}
                        </div>
                        <h2 className="mt-4 text-xl font-semibold">{pageTitle}</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {pageDescription}
                        </p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!registrationData && (
                            <div className="flex justify-center space-x-4 mb-4">
                                <Button
                                    type="button"
                                    variant={contactMethod === 'email' ? 'default' : 'outline'}
                                    onClick={() => setContactMethod('email')}
                                    className="flex items-center"
                                >
                                    <Mail className="mr-2 h-4 w-4" /> Email
                                </Button>
                                
                                <Button
                                    type="button"
                                    variant={contactMethod === 'phone' ? 'default' : 'outline'}
                                    onClick={() => setContactMethod('phone')}
                                    className="flex items-center"
                                >
                                    <Phone className="mr-2 h-4 w-4" /> Phone
                                </Button>
                            </div>
                        )}

                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                                {contactMethod === 'email' ? 'Email address' : 'Phone number'}
                            </label>
                            <div className="mt-1">
    <Input
        id="contact"
        name="contact"
        type={contactMethod === 'email' ? 'email' : 'tel'}
        autoComplete={contactMethod === 'email' ? 'email' : 'tel'}
        placeholder={contactMethod === 'email' ? 'name@example.com' : '+1234567890'}
        required
        value={emailOrPhone || ''} // Ensure we always have a string
        onChange={(e) => !registrationData && setEmailOrPhone(e.target.value)}
        readOnly={!!registrationData}
        className={registrationData ? "bg-gray-100" : ""}
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
                                onClick={handleBackClick}
                                type="button"
                                className="text-sm"
                            >
                                Back
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPSend;