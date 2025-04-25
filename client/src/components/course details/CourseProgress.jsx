import { useEffect, useState } from "react";
import { Award, BarChart, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Improved hook to fetch enrollment data
const useEnrollment = (studentId, courseId) => {
  const [enrollmentState, setEnrollmentState] = useState({
    isEnrolled: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!studentId || !courseId) {
      setEnrollmentState(prev => ({ ...prev, isLoading: false, error: "Missing studentId or courseId" }));
      return;
    }

    const checkEnrollment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/enrollments/check?studentId=${studentId}&courseId=${courseId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnrollmentState({
          isEnrolled: data?.isEnrolled || false,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setEnrollmentState({
          isEnrolled: false,
          isLoading: false,
          error: error.message,
        });
      }
    };

    checkEnrollment();
  }, [studentId, courseId]);

  return enrollmentState;
};

// Enhanced progress tracking hook
const useProgress = (studentId, courseId, isEnrolled) => {
  const [progressState, setProgressState] = useState({
    progress: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!studentId || !courseId) {
      setProgressState(prev => ({ ...prev, isLoading: false, error: "Missing studentId or courseId" }));
      return;
    }

    if (!isEnrolled) {
      setProgressState({
        progress: null,
        isLoading: false,
        error: null, // No error for non-enrolled users
      });
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress/${studentId}/${courseId}`);
        if (!res.ok) {
          // Handle expected errors (e.g., 404 for non-enrolled users)
          if (res.status === 404) {
            setProgressState({
              progress: null,
              isLoading: false,
              error: null, // Treat as non-enrolled rather than error
            });
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Progress data:", data);
        setProgressState({
          progress: data,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to fetch progress:", err);
        setProgressState({
          progress: null,
          isLoading: false,
          error: err.message,
        });
      }
    };

    fetchProgress();
  }, [studentId, courseId, isEnrolled]);

  return progressState;
};

export const CourseProgress = ({ studentId, courseId, course }) => {
  const navigate = useNavigate();
  const { isEnrolled, isLoading: enrollmentLoading, error: enrollmentError } = useEnrollment(studentId, courseId);
  const { progress, isLoading: progressLoading, error: progressError } = useProgress(studentId, courseId, isEnrolled);

  // Early validation for missing props
  if (!studentId || !courseId || !course) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
        <p className="text-red-500">Invalid course or user data. Please try again.</p>
      </div>
    );
  }

  if (enrollmentLoading || progressLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
        <p>Loading your progress...</p>
      </div>
    );
  }

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

  if (enrollmentError || progressError) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
        <p className="text-red-500">Error loading progress data. Please try again later.</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-blue-500 hover:text-blue-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  const percentage = progress?.progressPercentage || 0;
  const totalCompleted = progress?.completedLessons?.length || 0;
  const total = progress?.totalLessons || 0;

  const handleContinueLearning = () => {
    let nextLesson = null;
    for (const module of course.modules || []) {
      for (const lesson of module.lessons || []) {
        if (!progress?.completedLessons?.includes(lesson.id)) {
          nextLesson = lesson;
          break;
        }
      }
      if (nextLesson) break;
    }

    if (nextLesson) {
      navigate(`/get-certified/${course.id}/${studentId}`);
    } else {
      navigate(`/courses/${courseId}/complete`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sticky top-4">
      <h3 className="font-semibold mb-4">Your Progress</h3>
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>{Math.round(percentage)}% complete</span>
          <span>
            {totalCompleted}/{total} lessons
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-fidel-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <Button className="w-full mb-3" onClick={handleContinueLearning}>
        {percentage === 100 ? "View Certificate" : "Continue Learning"}
      </Button>
      <div className="mt-6 space-y-4">
        <NextLesson 
          modules={course.modules} 
          completedLessons={progress?.completedLessons || []} 
        />
        <CertificationNotice 
          course={course} 
          studentId={studentId} 
          isCompleted={percentage === 100} 
        />
      </div>
    </div>
  );
};

const NextLesson = ({ modules, completedLessons = [] }) => {
  let nextLesson = null;
  for (const module of modules || []) {
    for (const lesson of module.lessons || []) {
      if (!completedLessons.includes(lesson.id)) {
        nextLesson = lesson;
        break;
      }
    }
    if (nextLesson) break;
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3">
      <h4 className="font-medium mb-1">
        {nextLesson ? "Next Lesson" : "Course Completed"}
      </h4>
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
        <p className="text-sm text-muted-foreground">All lessons completed!</p>
      )}
    </div>
  );
};

const CertificationNotice = ({ course, studentId, isCompleted }) => {
  const navigate = useNavigate();

  const handleCertificationClick = () => {
    if (!studentId || !course.id) {
      console.error("Student ID or Course ID is undefined.");
      return;
    }
    navigate(`/get-certified/${course.id}/${studentId}`);
  };

  return (
    <div className={`rounded-lg p-3 ${isCompleted ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20' : 'bg-fidel-50 dark:bg-fidel-900/10 border border-fidel-100 dark:border-fidel-900/20'}`}>
      <Button
        className={`font-medium w-full text-left ${isCompleted ? 'text-green-800 dark:text-green-200' : 'text-fidel-800 dark:text-fidel-200'}`}
        onClick={handleCertificationClick}
        variant={isCompleted ? "success" : "default"}
      >
        {isCompleted ? "Get Your Certificate" : "Get Certified"}
      </Button>
      <p className={`text-xs mt-2 ${isCompleted ? 'text-green-600 dark:text-green-300' : 'text-fidel-600 dark:text-fidel-300'}`}>
        {isCompleted 
          ? "Congratulations! You've completed this course."
          : "Complete this course to earn your certification"}
      </p>
      <div className="flex items-center mt-2">
        <Award size={16} className={`mr-1 ${isCompleted ? 'text-green-500' : 'text-fidel-500'}`} />
        <div className={`text-xs font-medium ${isCompleted ? 'text-green-600' : 'text-fidel-600'}`}>
          {course.title} Certificate
        </div>
      </div>
    </div>
  );
};