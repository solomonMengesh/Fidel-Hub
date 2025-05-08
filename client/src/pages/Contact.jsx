import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ui/ThemeToggle";
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

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectChange = (value) => {
    setFormData({
      ...formData,
      subject: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(
        "Your message has been sent successfully! We'll get back to you soon."
      );
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer:
        "To enroll in a course, create an account or log in, browse our course catalog, select your desired course, and click the 'Enroll' button. Follow the checkout process to complete your enrollment.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Yes, Fidel Hub is fully responsive and optimized for mobile devices. You can access your courses on smartphones and tablets through our mobile-friendly website.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept payments through Chapa, which supports various payment methods including credit/debit cards, mobile money, and bank transfers specific to Ethiopia.",
    },
    {
      question: "How do I become an instructor?",
      answer:
        "To become an instructor, first create an account by submitting the required information. After your registration is reviewed and approved by the admin, you will gain access to instructor features and can start teaching.",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <div className="flex-1 pt-24 pb-12">
        {/* Hero section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-fidel-500 to-fidel-700 py-20 md:py-28">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-fidel-100 dark:bg-fidel-950/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-slate-100 dark:bg-slate-800/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Have questions or feedback? We're here to help. Reach out to our
                team using any of the methods below.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground mb-8">
                  Whether you have a question about our courses, need technical
                  support, or want to explore partnership opportunities, our
                  team is ready to assist you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-fidel-50 dark:bg-fidel-950/20 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-fidel-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Email
                    </h3>
                    <p className="text-muted-foreground">info@fidelhub.edu</p>
                    <p className="text-muted-foreground">
                      support@fidelhub.edu
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-fidel-50 dark:bg-fidel-950/20 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-fidel-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-muted-foreground">+251 11 234 5678</p>
                    <p className="text-muted-foreground">+251 91 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-fidel-50 dark:bg-fidel-950/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-fidel-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Location
                    </h3>
                    <p className="text-muted-foreground">
                      123 Education Street
                    </p>
                    <p className="text-muted-foreground">
                      Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-fidel-50 dark:bg-fidel-950/20 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-fidel-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Hours
                    </h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:30 AM - 5:00 PM
                    </p>
                    <p className="text-muted-foreground">
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Follow Us On Social Media
                </h3>
                <div className="flex space-x-4">
                  {[
                    {
                      icon: <Facebook className="h-5 w-5" />,
                      name: "Facebook",
                      color: "bg-blue-600",
                      link: "https://www.facebook.com",
                    },
                    {
                      icon: <Twitter className="h-5 w-5" />,
                      name: "Twitter",
                      color: "bg-sky-500",
                      link: "https://www.twitter.com",
                    },
                    {
                      icon: <Instagram className="h-5 w-5" />,
                      name: "Instagram",
                      color: "bg-pink-600",
                      link: "https://www.instagram.com",
                    },
                    {
                      icon: <Linkedin className="h-5 w-5" />,
                      name: "LinkedIn",
                      color: "bg-blue-700",
                      link: "https://www.linkedin.com",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} text-white h-10 w-10 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity`}
                    >
                      <span className="sr-only">{social.name}</span>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                    >
                      Subject
                    </label>
                    <Select
                      onValueChange={handleSubjectChange}
                      value={formData.subject}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="courses">
                          Course Information
                        </SelectItem>
                        <SelectItem value="technical">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="billing">
                          Billing & Payments
                        </SelectItem>
                        <SelectItem value="partnership">
                          Partnership Opportunities
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe how we can help you"
                      rows={5}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-fidel-500 hover:bg-fidel-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Map */}
        <div className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="h-80 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1275.1234567890123!2d38.76361111111111!3d9.030000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8f1234567890%3A0xabcdef1234567890!2s123%20Education%20Street%2C%20Addis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* FAQ Section */}

        {/* FAQ Section */}
        <div className="bg-slate-50 dark:bg-slate-800/30 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Find quick answers to common questions about Fidel Hub.
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="flex justify-between items-center w-full text-left text-lg font-semibold text-slate-900 dark:text-white"
                  >
                    {faq.question}
                    <span className="ml-2 text-xl">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mt-2 text-muted-foreground text-sm">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Contact;
