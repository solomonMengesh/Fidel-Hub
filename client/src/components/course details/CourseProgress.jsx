import { useEffect, useState } from "react";
import { Award, BarChart, PlayCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ReviewModal } from "./ReviewModal";
import { toast } from "sonner";

const API_BASE_URL = 'http://localhost:5000';

// Enrollment check hook
const useEnrollment = (studentId, courseId) => {
  const [enrollmentState, setEnrollmentState] = useState({
    isEnrolled: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!studentId || !courseId) {
      setEnrollmentState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Missing studentId or courseId" 
      }));
      return;
    }

    const checkEnrollment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/enrollments/check?studentId=${studentId}&courseId=${courseId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please log in to view enrollment status");
          }
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

// Progress tracking hook
const useProgress = (studentId, courseId, isEnrolled) => {
  const [progressState, setProgressState] = useState({
    progress: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!studentId || !courseId) {
      setProgressState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Missing studentId or courseId" 
      }));
      return;
    }

    if (!isEnrolled) {
      setProgressState({
        progress: null,
        isLoading: false,
        error: null,
      });
      return;
    }

    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("User not authenticated");
        }

        const res = await fetch(
          `${API_BASE_URL}/api/progress/${studentId}/${courseId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Please log in to view progress");
          }
          if (res.status === 404) {
            setProgressState({
              progress: null,
              isLoading: false,
              error: null,
            });
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { isEnrolled, isLoading: enrollmentLoading, error: enrollmentError } = useEnrollment(studentId, courseId);
  const { progress, isLoading: progressLoading, error: progressError } = useProgress(studentId, courseId, isEnrolled);

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: `/courses/${courseId}` } });
  };

  // First check if user is not logged in
  if (!studentId) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
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
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
          Please Sign In
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          You need to be logged in to view your course progress.
        </p>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleLoginRedirect}
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (!courseId || !course) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
        <p className="text-red-500">Invalid course data. Please try again.</p>
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

  // Handle authentication errors
  if (enrollmentError?.includes("log in") || progressError?.includes("log in")) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
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
            className="h-6 w-6 text-red-600 dark:text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
          Authentication Required
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {enrollmentError || progressError}
        </p>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleLoginRedirect}
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (enrollmentError || progressError) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
        <p className="text-red-500">{enrollmentError || progressError}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
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
        <Button 
          className="w-full bg-fidel-500 hover:bg-fidel-600"
          onClick={() => navigate(`/courses/${courseId}/enroll`)}
        >
          Enroll Now
        </Button>
      </div>
    );
  }

  const percentage = progress?.progressPercentage || 0;
  const totalCompleted = progress?.completedLessons?.length || 0;
  const total = progress?.totalLessons || 0;
  const hasReviewed = progress?.hasReviewed || false;

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
      navigate(`/learn/${course.id}/lesson/${nextLesson.id}`);
    } else {
      navigate(`/courses/${courseId}/complete`);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`${API_BASE_URL}/api/review/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          course: courseId,
          student: studentId,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to submit a review");
        }
        throw new Error('Failed to submit review');
      }

      const updatedProgress = await response.json();
      setProgressState(prev => ({
        ...prev,
        progress: updatedProgress
      }));
      
      setShowReviewModal(false);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message);
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

      {percentage === 100 && !hasReviewed && (
        <Button 
          variant="outline" 
          className="w-full mb-3" 
          onClick={() => setShowReviewModal(true)}
        >
          <Star className="mr-2 h-4 w-4" />
          Leave a Review
        </Button>
      )}

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

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
        courseTitle={course.title}
      />
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