import { useEffect, useState } from 'react';

export const InstructorTab = ({ course, studentId, token }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const instructorName =
    typeof course.instructor === 'object'
      ? course.instructor.name
      : course.instructor || 'Unknown Instructor';
  const instructorEmail =
    typeof course.instructor === 'object'
      ? course.instructor.email
      : null;

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/enrollments/check?studentId=${studentId}&courseId=${course._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.enrolled) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error('Enrollment check failed:', error);
      }  
    };

    if (studentId && token) {
      checkEnrollment();
    }
  }, [studentId, token, course._id]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">About the Instructor</h3>
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-xl font-medium">
            {instructorName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h4 className="font-semibold">{instructorName}</h4>
          <p className="text-muted-foreground text-sm mt-1">
            {course.instructor?.bio || 'Expert instructor with years of experience'}
          </p>
          {isEnrolled && instructorEmail && (
            <a
              href={`mailto:${instructorEmail}`}
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              Contact Instructor
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
