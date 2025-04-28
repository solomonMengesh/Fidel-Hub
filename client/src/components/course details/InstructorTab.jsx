 export const InstructorTab = ({ course }) => {
    const instructorName = typeof course.instructor === 'object' 
      ? course.instructor.name 
      : course.instructor || 'Unknown Instructor';
  
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
          </div>
        </div>
      </div>
    );
  };