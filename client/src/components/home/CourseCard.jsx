import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const CourseCard = ({
  id,
  title,
  instructor = { name: "Unknown Instructor" },
  category = "Uncategorized",
  level = "All Levels",
  price = 0,
  thumbnail = {},
  modules = [],
  avgRating = "N/A",
  totalReviews = 0,
  students = 0,
  featured = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate total lessons and duration
  const totalLessons = modules.reduce(
    (total, module) => total + (module.lessons?.length || 0),
    0
  );

  // Calculate total duration (assuming each lesson has duration in "minutes:seconds" format)
  const totalDuration = modules.reduce((total, module) => {
    const moduleDuration = module.lessons?.reduce((sum, lesson) => {
      const [minutes, seconds] = lesson.duration?.split(':').map(Number) || [0, 0];
      return sum + minutes + (seconds / 60);
    }, 0) || 0;
    return total + moduleDuration;
  }, 0);

  // Format duration for display
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = Math.round(minutes % 60);
    return `${hours}h ${remainingMins}m`;
  };

  const instructorName = instructor?.name || "Unknown Instructor";
  const imageUrl = thumbnail?.url;
  const categoryName = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

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
              style={imageUrl ? { 
                backgroundImage: `url(${imageUrl})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              } : {}}
            >
              {!imageUrl && (
                <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600">
                  <BookOpen size={48} />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-60"></div>
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-medium bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white px-2.5 py-1 rounded-full">
                {categoryName}
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
                by <span className="text-slate-900 dark:text-slate-200">{instructorName}</span>
              </p>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-300 fill-yellow-300 mr-1" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {avgRating === "N/A" ? "N/A" : parseFloat(avgRating).toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({totalReviews.toLocaleString()} ratings)
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users size={14} />
                  <span className="ml-1 text-sm">
                    {students.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock size={14} />
                  <span className="ml-1 text-sm">
                    {totalDuration > 0 ? formatDuration(totalDuration) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-3 mt-auto flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <div className="text-sm text-muted-foreground">
                <BookOpen size={14} className="inline mr-1" /> {totalLessons} lessons
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {price > 0 ? `${price.toFixed(2)} ETH` : "Free"}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

CourseCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  instructor: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string
  }),
  category: PropTypes.string,
  level: PropTypes.string,
  price: PropTypes.number,
  thumbnail: PropTypes.shape({
    url: PropTypes.string,
    publicId: PropTypes.string
  }),
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      lessons: PropTypes.array
    })
  ),
  avgRating: PropTypes.string,
  totalReviews: PropTypes.number,
  students: PropTypes.number,
  featured: PropTypes.bool
};

export default CourseCard;