import { useEffect, useState } from "react";
import { Award, BarChart, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Hook to fetch enrollment data
const useEnrollment = (studentId, courseId) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/enrollments/check?studentId=${studentId}&courseId=${courseId}`
        );
        const data = await response.json();
        setIsEnrolled(data?.isEnrolled || false);
      } catch (error) {
        console.error("Error checking enrollment:", error);
      } finally {
        setEnrollmentLoading(false);
      }
    };

    if (studentId && courseId) {
      checkEnrollment();
    }
  }, [studentId, courseId]);

  return { isEnrolled, enrollmentLoading };
};

// Hook to fetch progress data
const useProgress = (studentId, courseId) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress/${studentId}/${courseId}`);
        const data = await res.json();
        setProgress(data);
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId && courseId) {
      fetchProgress();
    }
  }, [studentId, courseId]);

  return { progress, loading };
};

export const CourseProgress = ({ studentId, courseId, course }) => {
  const { isEnrolled, enrollmentLoading } = useEnrollment(studentId, courseId);
  const { progress, loading } = useProgress(studentId, courseId);

  if (enrollmentLoading || loading) return <p>Loading...</p>; // Show a loading state while fetching progress or enrollment data

  if (!isEnrolled) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-amber-600 dark:text-amber-400"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
          Course Access Required
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          You are not currently enrolled in this course.
        </p>
        <Button className="w-full bg-fidel-500 hover:bg-fidel-600">
          Enroll Now
        </Button>
      </div>
    );
  }

  const percentage = progress ? progress.progressPercentage : 0;
  const totalCompleted = progress ? progress.completedLessons.length : 0;
  const total = progress ? progress.totalLessons : 0;

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
        <CertificationNotice course={course} studentId={studentId} />
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

const CertificationNotice = ({ course, studentId }) => {
  const navigate = useNavigate();

  const handleCertificationClick = () => {
    if (!studentId || !course.id) {
      console.error("Student ID or Course ID is undefined.");
      return;
    }

    navigate(`/get-certified/${course.id}/${studentId}`);
  };

  return (
    <div className="rounded-lg p-3 bg-fidel-50 dark:bg-fidel-900/10 border border-fidel-100 dark:border-fidel-900/20">
      {/* Changed header to a button */}
      <Button
        className="font-medium text-fidel-800 dark:text-fidel-200 mb-1 w-full text-left"
        onClick={handleCertificationClick}
      >
        Get Certified
      </Button>
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
