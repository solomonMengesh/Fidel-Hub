import { Award, BarChart, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CourseProgress = ({ 
  percentage, 
  totalCompleted, 
  total, 
  course 
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sticky top-4">
      <h3 className="font-semibold mb-4">Your Progress</h3>
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>{percentage}% complete</span>
          <span>
            {totalCompleted}/{total} lessons
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-fidel-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <Button className="w-full mb-3">Continue Learning</Button>
      <div className="mt-6 space-y-4">
        <NextLesson modules={course.modules} />
        <CertificationNotice course={course} />
      </div>
    </div>
  );
};

const NextLesson = ({ modules }) => {
  const nextLesson = modules?.[0]?.lessons?.[0];
  
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3">
      <h4 className="font-medium mb-1">Next Lesson</h4>
      {nextLesson ? (
        <>
          <div className="flex items-center text-fidel-600">
            {nextLesson.type === "quiz" ? (
              <BarChart size={16} className="mr-2" />
            ) : (
              <PlayCircle size={16} className="mr-2" />
            )}
            <span className="text-sm">{nextLesson.title}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {nextLesson.duration || 'N/A'}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No lessons available</p>
      )}
    </div>
  );
};

const CertificationNotice = ({ course }) => {
  return (
    <div className="rounded-lg p-3 bg-fidel-50 dark:bg-fidel-900/10 border border-fidel-100 dark:border-fidel-900/20">
      <h4 className="font-medium text-fidel-800 dark:text-fidel-200 mb-1">Get Certified</h4>
      <p className="text-xs text-fidel-600 dark:text-fidel-300 mb-2">
        Complete this course to earn your certification
      </p>
      <div className="flex items-center">
        <Award size={16} className="text-fidel-500 mr-1" />
        <div className="text-xs font-medium text-fidel-600">{course.title} Certificate</div>
      </div>
    </div>
  );
};