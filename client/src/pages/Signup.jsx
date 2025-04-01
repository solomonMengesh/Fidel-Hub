import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  Phone,
  Upload,
  BookOpen,
  Lock,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const formSchema = z
    .object({
      name: z
        .string()
        .min(3, "Name is required and must be at least 3 characters long."),
      email: z.string().email("Please enter a valid email address."),
      phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits.")
        .optional(),
      role: z.enum(["student", "instructor"]),
      expertise: z
        .string()
        .optional()
        .refine((val) => {
          return (
            (val !== undefined && val !== "") ||
            formValues.role !== "instructor"
          );
        }, "Expertise is required for instructors."),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long."),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords must match.",
      path: ["confirmPassword"],
    })
    .refine(
      (data) => {
        if (data.role === "instructor") {
          return cvFile !== null;
        }
        return true;
      },
      {
        message: "CV is required for instructors.",
        path: ["cv"],
      }
    );

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    expertise: "",
    password: "",
    confirmPassword: "",
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid File Type",
          description: "Only PDF files are allowed.",
          variant: "destructive",
        });
        return;
      }
      setCvFile(file);
    }
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      formData.append("role", values.role);
      if (values.role === "instructor") {
        formData.append("expertise", values.expertise || "");
        if (cvFile) formData.append("cv", cvFile);
      }
      formData.append("password", values.password);

      toast({
        title: "Registration Successful",
        description:
          values.role === "instructor"
            ? "Your account is under review for instructor approval."
            : "Welcome to our platform!",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred while creating your account.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = (value) => {
    form.setValue("role", value);
    setFormValues({ ...formValues, role: value });
    if (value === "student") {
      form.setValue("expertise", "");
      setFormValues({ ...formValues, role: value, expertise: "" });
      setCvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-5">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join us to start your learning journey
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 md:p-8 shadow-lg"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Full Name 
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    {...form.register("name")}
                    onChange={(e) =>
                      setFormValues({ ...formValues, name: e.target.value })
                    }
                    required
                    className="glass-input pl-10"
                    placeholder="John Doe"
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    onChange={(e) =>
                      setFormValues({ ...formValues, email: e.target.value })
                    }
                    required
                    className="glass-input pl-10"
                    placeholder="your.email@example.com"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    onChange={(e) =>
                      setFormValues({ ...formValues, phone: e.target.value })
                    }
                    className="glass-input pl-10"
                    placeholder="+1 (123) 456-7890"
                  />
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Join As
                </label>
                <Select
                  value={form.watch("role")}
                  onValueChange={(value) => handleRoleChange(value)}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.watch("role") === "instructor" && (
                <>
                  <div>
                    <label
                      htmlFor="expertise"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Expertise
                    </label>
                    <div className="relative">
                      <Textarea
                        id="expertise"
                        {...form.register("expertise")}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            expertise: e.target.value,
                          })
                        }
                        className="glass-input pl-10"
                        placeholder="Your areas of expertise"
                      />
                      <BookOpen
                        className="absolute left-3 top-3 text-muted-foreground"
                        size={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cv"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      CV (PDF only)
                    </label>
                    <div className="relative">
                      <label
                        htmlFor="cv-upload"
                        className="flex flex-col items-center justify-center w-full glass-input p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-fidel-500 transition-colors"
                      >
                        <div className="flex items-center">
                          <Upload className="w-5 h-5 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {cvFile ? cvFile.name : "Click to upload your CV"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Only PDF files are allowed
                        </p>
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    onChange={(e) =>
                      setFormValues({ ...formValues, password: e.target.value })
                    }
                    required
                    className="glass-input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...form.register("confirmPassword")}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="glass-input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-fidel-500 hover:bg-fidel-600 text-white"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-fidel-600 hover:text-fidel-500 font-medium"
            >
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
