import { motion } from "framer-motion";
import AnimatedButton from "../../components/ui/AnimatedButton ";

const CallToAction = () => {
  return (
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
          Join thousands of students who are already benefiting from our
          innovative platform. Start your learning journey today!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <AnimatedButton
            to="/signup"
            size="lg"
            variant="outline"
            className="bg-white text-fidel-600 hover:bg-slate-100"
          >
            Get Started Now
          </AnimatedButton>
          <AnimatedButton
            to="/courses"
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-fidel-600/50 hover:text-black "
          >
            Explore Courses
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
