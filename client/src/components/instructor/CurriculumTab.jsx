import { useState } from "react";
import { BookOpen } from "lucide-react";
import ModuleList from "./ModuleList";
import LessonEditor from "./LessonEditor";

const CurriculumTab = () => {
  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Introduction to the Course",
      description: "",
      lessons: [
        {
          id: 101,
          title: "Welcome to the Course",
          type: "video",
          duration: "5:30",
          content: "",
          free: false,
        },
      ],
    },
  ]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);

  // Module handlers
  const addModule = () => {
    const newModuleId = modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1;
    setModules([
      ...modules,
      {
        id: newModuleId,
        title: `Module ${modules.length + 1}`,
        description: "",
        lessons: [],
      },
    ]);
  };

  const deleteModule = (moduleId) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const updateModule = (moduleId, field, value) => {
    setModules(
      modules.map(module =>
        module.id === moduleId ? { ...module, [field]: value } : module
      )
    );
  };

  const moveModule = (moduleId, direction) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (
      (direction === "up" && moduleIndex === 0) ||
      (direction === "down" && moduleIndex === modules.length - 1)
    ) {
      return;
    }

    const newModules = [...modules];
    const moduleToMove = newModules[moduleIndex];

    if (direction === "up") {
      newModules[moduleIndex] = newModules[moduleIndex - 1];
      newModules[moduleIndex - 1] = moduleToMove;
    } else {
      newModules[moduleIndex] = newModules[moduleIndex + 1];
      newModules[moduleIndex + 1] = moduleToMove;
    }

    setModules(newModules);
  };

  // Lesson handlers
  const addLesson = (moduleId, type = "video") => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const newLessonId =
      module.lessons.length > 0
        ? Math.max(...module.lessons.map(l => l.id)) + 1
        : moduleId * 100 + 1;

    const newLesson = {
      id: newLessonId,
      title: `${type === "video" ? "Video" : "Quiz"} ${module.lessons.length + 1}`,
      type,
      duration: type === "video" ? "0:00" : "15:00",
      content: "",
      free: false,
    };

    if (type === "quiz") {
      newLesson.quizQuestions = [];
    }

    setModules(
      modules.map(module =>
        module.id === moduleId
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      )
    );

    setSelectedModule(moduleId);
    setSelectedLesson(newLessonId);
  };

  const deleteLesson = (moduleId, lessonId) => {
    setModules(
      modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.filter(lesson => lesson.id !== lessonId),
            }
          : module
      )
    );

    if (selectedModule === moduleId && selectedLesson === lessonId) {
      setSelectedLesson(null);
    }
  };

  const updateLesson = (moduleId, lessonId, field, value) => {
    setModules(
      modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
              ),
            }
          : module
      )
    );
  };

  const moveLesson = (moduleId, lessonId, direction) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    const module = modules[moduleIndex];
    const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);

    if (
      (direction === "up" && lessonIndex === 0) ||
      (direction === "down" && lessonIndex === module.lessons.length - 1)
    ) {
      return;
    }

    const newLessons = [...module.lessons];
    const lessonToMove = newLessons[lessonIndex];

    if (direction === "up") {
      newLessons[lessonIndex] = newLessons[lessonIndex - 1];
      newLessons[lessonIndex - 1] = lessonToMove;
    } else {
      newLessons[lessonIndex] = newLessons[lessonIndex + 1];
      newLessons[lessonIndex + 1] = lessonToMove;
    }

    setModules(
      modules.map(m =>
        m.id === moduleId ? { ...m, lessons: newLessons } : m
      )
    );
  };

  const selectLesson = (moduleId, lessonId) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);

    const module = modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find(l => l.id === lessonId);

    if (lesson?.type === "quiz") {
      setCurrentQuizQuestions(lesson.quizQuestions || []);
    }
  };

  const handleQuizQuestionsChange = (questions) => {
    setCurrentQuizQuestions(questions);
    if (selectedModule && selectedLesson) {
      updateLesson(selectedModule, selectedLesson, "quizQuestions", questions);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          <BookOpen className="inline mr-2" size={18} />
          Course Curriculum
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Organize your course content into modules and lessons
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <ModuleList 
              modules={modules}
              selectedModule={selectedModule}
              selectedLesson={selectedLesson}
              addModule={addModule}
              deleteModule={deleteModule}
              updateModule={updateModule}
              moveModule={moveModule}
              addLesson={addLesson}
              selectLesson={selectLesson}
            />
          </div>

          <div className="lg:col-span-8">
            {selectedModule !== null && selectedLesson !== null ? (
              <LessonEditor
                modules={modules}
                selectedModule={selectedModule}
                selectedLesson={selectedLesson}
                updateLesson={updateLesson}
                moveLesson={moveLesson}
                deleteLesson={deleteLesson}
                quizQuestions={currentQuizQuestions}
                onQuizQuestionsChange={handleQuizQuestionsChange}
              />
            ) : (
              <div className="p-8 text-center border border-dashed rounded-lg">
                <BookOpen
                  size={40}
                  className="mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="font-medium mb-2">No Lesson Selected</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Select a lesson from the module list or create a new one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumTab;
