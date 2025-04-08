import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OTPVerificationComponent from '../components/auth/OTPVerification';
import { Link } from 'react-router-dom';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state
  const email = location.state?.email;
  const isPasswordReset = location.state?.isPasswordReset || location.state?.flowType === 'password-reset';
  const isRegistration = location.state?.flowType === 'registration';
  const registrationData = location.state?.registrationData;
  
  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);
  
  const handleVerificationSuccess = () => {
    if (isPasswordReset) {
      // If password reset was successful, go to login page
      navigate('/login', { 
        replace: true,
        state: { passwordReset: true }
      });
    } else if (isRegistration && registrationData) {
      // Complete the registration process
      navigate('/login', { 
        replace: true,
        state: { 
          verifiedData: registrationData,
          verifiedEmail: email
        }
      });
    } else {
      // Normal login flow
      navigate(location.state?.from || '/dashboard', { replace: true });
    }
  };
  
  const handleBack = () => {
    if (isPasswordReset) {
      navigate('/forgot-password', { replace: true });
    } else if (isRegistration) {
      navigate('/send-otp', { 
        replace: true, 
        state: { 
          flowType: 'registration',
          registrationData
        }
      });
    } else {
      navigate('/login', { replace: true });
    }
  };
  
  if (!email) {
    return null; // Will redirect in useEffect
  }
  
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
          <OTPVerificationComponent 
            email={email}
            onSuccess={handleVerificationSuccess}
            onBack={handleBack}
            isPasswordReset={isPasswordReset}
            isRegistration={isRegistration}
          />
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
