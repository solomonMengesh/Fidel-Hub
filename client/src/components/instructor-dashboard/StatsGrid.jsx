import { motion } from "framer-motion";
import { Users, BookOpen, CheckCircle, Star } from "lucide-react"; // Directly import icons

const StatsGrid = ({ stats }) => {
  const Icon = ({ name }) => {
    const icons = {
      Users,
      BookOpen,
      CheckCircle,
      Star,
    };
    const Component = icons[name];
    return <Component size={20} className="text-fidel-500 dark:text-fidel-400" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              <p className="text-xs text-green-500 mt-1">
                {stat.change} this month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-fidel-50 dark:bg-slate-800">
              <Icon name={stat.icon} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
