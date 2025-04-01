import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Progress } from "@/components/ui/progress";

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-fidel-100 dark:bg-fidel-950/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-slate-100 dark:bg-slate-800/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>
        
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 md:p-8 shadow-lg text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
              <Clock className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Application Under Review</h1>
            <p className="text-muted-foreground mb-6">
              Your instructor application has been submitted and is currently being reviewed by our team.
            </p>
            
            <div className="space-y-1 mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Application Status</span>
                <span className="font-medium">Pending Review</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-6 text-left">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">What happens next?</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Our team will review your application within 1-3 business days</li>
                    <li>You'll receive an email notification once your application is approved</li>
                    <li>After approval, you can log in and start creating courses</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default PendingApproval;

