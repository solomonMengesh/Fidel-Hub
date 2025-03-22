import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CourseCard = ({
  id,
  title,
  instructor,
  level,
  rating,
  students,
  duration,
  lessons,
  image,
  price,
  featured = false,
  category,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl h-full transition-all duration-300",
        featured ? "shadow-lg" : "shadow-sm hover:shadow-md"
      )}
    >
      <Link to={`/courses/${id}`} className="block h-full">
        <div className="relative h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-xs font-medium bg-fidel-500 text-white px-2.5 py-1 rounded-full">
                Featured
              </span>
            </div>
          )}
          
          <div className="relative h-48 overflow-hidden">
            <div 
              className={cn(
                "absolute inset-0 bg-slate-200 dark:bg-slate-800 transition-transform duration-500",
                isHovered ? "scale-105" : "scale-100"
              )}
              style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {!image && (
                <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600">
                  <BookOpen size={48} />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-60"></div>
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-medium bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white px-2.5 py-1 rounded-full">
                {category}
              </span>
              <span className="text-xs font-medium bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white px-2.5 py-1 rounded-full">
                {level}
              </span>
            </div>
          </div>
          
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white group-hover:text-fidel-500 transition-colors duration-200">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                by <span className="text-slate-900 dark:text-slate-200">{instructor}</span>
              </p>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users size={14} />
                  <span className="ml-1 text-sm">{students.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock size={14} />
                  <span className="ml-1 text-sm">{duration}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-3 mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div className="text-sm text-muted-foreground">
                <BookOpen size={14} className="inline mr-1" /> {lessons} lessons
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {price || "Free"}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
