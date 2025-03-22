import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import PopularCourses from "@/components/home/PopularCourses";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AnimatedButton from "../components/ui/AnimatedButton ";  // Correct relative path

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <PopularCourses />
        
        {/* Call to Action Section */}
        <section className="py-20 bg-fidel-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-slate-900 to-transparent opacity-20"></div>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-fidel-400 rounded-full blur-3xl opacity-30 -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-fidel-600 rounded-full blur-3xl opacity-30 -z-10"></div>
          
          <div className="max-w-4xl mx-auto px-6 md:px-8 text-center text-white">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Transform Your Learning Experience?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-white/80 mb-10 text-lg"
            >
              Join thousands of students who are already benefiting from our innovative platform. Start your learning journey today!
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <AnimatedButton to="/signup" size="lg" className="bg-white text-fidel-600 hover:bg-slate-100">
                Get Started Now
              </AnimatedButton>
              <AnimatedButton to="/courses" size="lg" variant="outline" className="border-white/30 text-white hover:bg-fidel-600/50">
                Explore Courses
              </AnimatedButton>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-fidel-50 dark:bg-fidel-900/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-fidel-600 dark:text-fidel-400 text-sm font-medium">Student Voices</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                What Our Students Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from students who have experienced the difference our platform makes in their educational journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="text-amber-400 mr-1">★</div>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                    {i === 1 ? (
                      "The quality of the courses and the interactive nature of the platform has exceeded my expectations. I've been able to learn at my own pace while still feeling connected to instructors and peers."
                    ) : i === 2 ? (
                      "As someone with a busy schedule, the flexibility of Fidel Hub has been a game-changer. The mobile responsiveness means I can learn on the go, and the real-time support has helped me overcome challenges quickly."
                    ) : (
                      "The student services integration is what sets Fidel Hub apart. Being able to manage my dormitory application and transcript requests in the same place I take my courses has saved me so much time and hassle."
                    )}
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 mr-4"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {i === 1 ? "Alex Thompson" : i === 2 ? "Maria Rodriguez" : "David Chen"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {i === 1 ? "Computer Science Student" : i === 2 ? "Business Administration" : "Psychology Major"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Index;
