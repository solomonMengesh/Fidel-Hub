import { createContext, useContext, useState } from "react";

const CourseContext = createContext();

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

const CourseProvider = ({ children }) => {
  const [courseId, setCourseId] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const [lessonId, setLessonId] = useState(null);

  return (
    <CourseContext.Provider
      value={{
        courseId,
        setCourseId,
        moduleId,
        setModuleId,
        lessonId,
        setLessonId,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export default CourseProvider;