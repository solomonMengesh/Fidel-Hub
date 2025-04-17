import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
    prerequisites: '',
    technicalRequirements: '',
    modules: []
  });
  const [files, setFiles] = useState({
    courseImage: null,
    lessonVideos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: selectedFiles }));
  };

  const addModule = () => {
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, {
        title: '',
        description: '',
        lessons: []
      }]
    }));
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[index][field] = value;
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  const addLesson = (moduleIndex, type) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].lessons.push({
      title: '',
      lessonType: type,
      description: '',
      duration: 0,
      ...(type === 'quiz' ? { quizQuestions: [] } : {})
    });
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  const addQuizQuestion = (moduleIndex, lessonIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].lessons[lessonIndex].quizQuestions.push({
      question: '',
      options: ['', '', ''],
      correctAnswer: 0
    });
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  const updateQuizQuestion = (moduleIndex, lessonIndex, questionIndex, field, value) => {
    const updatedModules = [...course.modules];
    if (field === 'options') {
      const optionIndex = value.optionIndex;
      updatedModules[moduleIndex].lessons[lessonIndex].quizQuestions[questionIndex].options[optionIndex] = value.value;
    } else {
      updatedModules[moduleIndex].lessons[lessonIndex].quizQuestions[questionIndex][field] = value;
    }
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add course data
      formData.append('title', course.title);
      formData.append('description', course.description);
      formData.append('category', course.category);
      formData.append('level', course.level);
      formData.append('price', course.price);
      formData.append('prerequisites', course.prerequisites);
      formData.append('technicalRequirements', course.technicalRequirements);
      formData.append('modules', JSON.stringify(course.modules));
      
      // Add files
      if (files.courseImage) {
        formData.append('courseImage', files.courseImage[0]);
      }
      
      if (files.lessonVideos) {
        Array.from(files.lessonVideos).forEach(file => {
          formData.append('lessonVideo', file);
        });
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/courses/create-course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      navigate(`/courses/${response.data.course._id}`);
    } catch (err) {
      console.error('Course creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Course Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title*</label>
              <input
                type="text"
                name="title"
                value={course.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category*</label>
              <input
                type="text"
                name="category"
                value={course.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select
                name="level"
                value={course.level}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                name="price"
                value={course.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Description*</label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Course Image</label>
            <input
              type="file"
              name="courseImage"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>
        
        {/* Modules Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Modules</h2>
            <button
              type="button"
              onClick={addModule}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Module
            </button>
          </div>
          
          {course.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-6 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module Title</label>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={module.description}
                    onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => addLesson(moduleIndex, 'video')}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Video Lesson
                </button>
                <button
                  type="button"
                  onClick={() => addLesson(moduleIndex, 'quiz')}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Add Quiz Lesson
                </button>
              </div>
              
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="ml-4 mb-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lesson Type</label>
                      <div className="mt-1">{lesson.lessonType}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={lesson.description}
                      onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'description', e.target.value)}
                      rows="2"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  {lesson.lessonType === 'video' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                      <input
                        type="number"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', parseInt(e.target.value))}
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  
                  {lesson.lessonType === 'quiz' && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Quiz Questions</h3>
                        <button
                          type="button"
                          onClick={() => addQuizQuestion(moduleIndex, lessonIndex)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                        >
                          Add Question
                        </button>
                      </div>
                      
                      {lesson.quizQuestions.map((question, questionIndex) => (
                        <div key={questionIndex} className="ml-4 mb-4 p-3 border rounded bg-gray-50">
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Question</label>
                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) => updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'question', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Options</label>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center mb-1">
                                <input
                                  type="radio"
                                  name={`correct-${moduleIndex}-${lessonIndex}-${questionIndex}`}
                                  checked={question.correctAnswer === optionIndex}
                                  onChange={() => updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'correctAnswer', optionIndex)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'options', {
                                    optionIndex,
                                    value: e.target.value
                                  })}
                                  className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Lesson Videos Upload */}
        {course.modules.some(m => m.lessons.some(l => l.lessonType === 'video')) && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Upload Lesson Videos</h2>
            <input
              type="file"
              name="lessonVideos"
              onChange={handleFileChange}
              accept="video/*"
              multiple
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload all video files in order (one for each video lesson)
            </p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;