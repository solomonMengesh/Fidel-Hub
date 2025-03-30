// components/home/TestimonialCard.jsx
import { motion } from "framer-motion";

const TestimonialCard = ({ index }) => {
  const testimonials = [
    {
      quote:
        "The quality of the courses and the interactive nature of the platform has exceeded my expectations. I've been able to learn at my own pace while still feeling connected to instructors and peers.",
      name: "Abebe Z",
      role: "Computer Science Student",
    },
    {
      quote:
        "As someone with a busy schedule, the flexibility of Fidel Hub has been a game-changer. The mobile responsiveness means I can learn on the go, and the real-time support has helped me overcome challenges quickly.",
      name: "Kebede M",
      role: "Business Administration",
    },
    {
      quote:
        "The student services integration is what sets Fidel Hub apart. Being able to manage my dormitory application and transcript requests in the same place I take my courses has saved me so much time and hassle.",
      name: "Alemitu T",
      role: "Psychology Major",
    },
  ];

  const { quote, name, role } = testimonials[index - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass-card p-6"
    >
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="text-amber-400 mr-1">
            ★
          </div>
        ))}
      </div>
      <p className="text-slate-600 dark:text-slate-300 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 mr-4"></div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">
            {name}
          </h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
