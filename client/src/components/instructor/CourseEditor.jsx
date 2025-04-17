// import { useState } from 'react';
// import ModuleList from './ModuleList';
// import { toast } from 'react-toastify';

// const CourseEditor = () => {
//   const [modules, setModules] = useState([]);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [selectedLesson, setSelectedLesson] = useState(null);

//   const handleAddModule = (newModule) => {
//     setModules((prevModules) => {
//       const updatedModules = [...prevModules, newModule];
//       console.log("Updated Modules:", updatedModules);
//       return updatedModules;
//     });
//   };

//   const updateModule = (moduleId, field, value) => {
//     setModules(
//       modules.map((module) =>
//         (module._id || module.id) === moduleId ? { ...module, [field]: value } : module
//       )
//     );
//   };

//   const deleteModule = (moduleId) => {
//     setModules(modules.filter((module) => (module._id || module.id) !== moduleId));
//   };

//   const moveModule = (moduleId, direction) => {
//     const index = modules.findIndex((module) => (module._id || module.id) === moduleId);
//     const newModules = [...modules];
//     if (direction === "up" && index > 0) {
//       [newModules[index - 1], newModules[index]] = [
//         newModules[index],
//         newModules[index - 1],
//       ];
//     } else if (direction === "down" && index < modules.length - 1) {
//       [newModules[index], newModules[index + 1]] = [
//         newModules[index + 1],
//         newModules[index],
//       ];
//     }
//     setModules(newModules);
//   };

//   const addLesson = (moduleId, type) => {
//     setModules(
//       modules.map((module) => {
//         if ((module._id || module.id) === moduleId) {
//           const newLessonId =
//             module.lessons.length > 0
//               ? Math.max(...module.lessons.map((l) => l.id)) + 1
//               : parseInt(moduleId) * 100 + 1;
//           const newLesson = {
//             id: newLessonId,
//             title: type === "video" ? "New Video Lesson" : "New Quiz",
//             type,
//             duration: "00:00",
//             content: "",
//             free: false,
//             order: module.lessons.length + 1,
//           };
//           return { ...module, lessons: [...module.lessons, newLesson] };
//         }
//         return module;
//       })
//     );
//   };

//   const selectLesson = (moduleId, lessonId) => {
//     setSelectedModule(moduleId);
//     setSelectedLesson(lessonId);
//   };

//   return (
//     <div className="p-6 bg-gray-900 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4 text-white">Course Editor</h1>
//       <ModuleList
//         modules={modules}
//         selectedModule={selectedModule}
//         selectedLesson={selectedLesson}
//         deleteModule={deleteModule}
//         updateModule={updateModule}
//         moveModule={moveModule}
//         addLesson={addLesson}
//         selectLesson={selectLesson}
//         setVideoUploads={() => {}}
//         onAddModule={handleAddModule}
//       />
//     </div>
//   );
// };

// export default CourseEditor;