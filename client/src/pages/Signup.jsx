import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Mail, User, Phone, Upload, BookOpen, Lock, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(3, 'Name is required and must be at least 3 characters long.'),
    email: z.string().email('Please enter a valid email address.'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits.').optional(),
    role: z.enum(['student', 'instructor']),
    expertise: z.string().optional().refine((val, ctx) => {
      return val !== undefined && val !== '' || ctx.parent.role !== 'instructor';
    }, 'Expertise is required for instructors.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword']
  }).refine(data => {
    if (data.role === 'instructor') {
      return cvFile !== null;
    }
    return true;
  }, {
    message: 'CV is required for instructors.',
    path: ['cv']
  });

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    expertise: '',
    password: '',
    confirmPassword: ''
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formValues
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid File Type',
          description: 'Only PDF files are allowed.',
          variant: "destructive"
        });
        return;
      }
      setCvFile(file);
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      if (values.phone) formData.append('phone', values.phone);
      formData.append('role', values.role);
      if (values.role === 'instructor') {
        formData.append('expertise', values.expertise || '');
        if (cvFile) formData.append('cv', cvFile);
      }
      formData.append('password', values.password);

      toast({
        title: 'Registration Successful',
        description: values.role === 'instructor' 
          ? 'Your account is under review for instructor approval.' 
          : 'Welcome to Fidel-Hub!',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'An error occurred while creating your account.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (value) => {
    form.setValue('role', value);
    setFormValues({ ...formValues, role: value });
    if (value === 'student') {
      form.setValue('expertise', '');
      setFormValues({ ...formValues, role: value, expertise: '' });
      setCvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* <Link to="/">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Fidel-Hub
          </h2>
        </Link> */}
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            log in to an existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </label>
              <input 
                {...form.register('name')}
                placeholder="Enter your full name"
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </label>
              <input 
                {...form.register('email')}
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone (Optional)
              </label>
              <input 
                {...form.register('phone')}
                type="tel"
                placeholder="Enter your phone number"
                onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label>Join As</label>
              <Select
                value={form.watch('role')}
                onValueChange={(value) => handleRoleChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.watch('role') === 'instructor' && (
              <>
                <div>
                  <label className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Expertise
                  </label>
                  <Textarea 
                    {...form.register('expertise')}
                    placeholder="Enter your area of expertise"
                    onChange={(e) => setFormValues({ ...formValues, expertise: e.target.value })}
                    className="textarea"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    CV
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="cv-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        {cvFile ? cvFile.name : 'Upload your CV'}
                      </p>
                      <p className="text-xs text-gray-500">Only PDF files are allowed.</p>
                    </label>
                    <input
                      id="cv-upload"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Password
              </label>
              <input 
                {...form.register('password')}
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Confirm Password
              </label>
              <input 
                {...form.register('confirmPassword')}
                type="password"
                placeholder="Confirm your password"
                onChange={(e) => setFormValues({ ...formValues, confirmPassword: e.target.value })}
                className="input"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
