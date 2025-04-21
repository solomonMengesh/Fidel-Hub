 import { Check, ChevronRight } from "lucide-react";
 import { Button } from "@/components/ui/button";

export const OverviewTab = ({ course, total }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">About This Course</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p>{course.description}</p>
          </div>
        </div>

        {course.whatYouWillLearn && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.whatYouWillLearn.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check size={18} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {course.requirements && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Requirements</h3>
            <ul className="space-y-2">
              {course.requirements.map((item, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight size={18} className="mr-2 text-fidel-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sticky top-4">
          <h3 className="font-semibold mb-4">Course Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Level</span>
              <span className="font-medium">{course.level || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">{course.category || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Language</span>
              <span className="font-medium">{course.language || 'English'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">
                {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Duration</span>
              <span className="font-medium">{course.totalDuration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Lessons</span>
              <span className="font-medium">{total}</span>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 mt-5 pt-5">
            <Button className="w-full">Enroll Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};