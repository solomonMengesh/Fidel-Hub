import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Plus, Trash2, Video, FileText, Edit, Eye, EyeOff, Upload, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import MultipleChoiceQuiz from "../instructor/MultipleChoiceQuiz "; // Assuming the quiz component is the same
import { Checkbox } from "../ui/Checkbox ";
// Removed unused imports
import { Label } from "@/components/ui/label";

const CourseBuilder = ({ initialCourse, onSave }) => {
  const [course, setCourse] = useState(initialCourse || {
    title: "",
    description: "",
    sections: []
  });
  
  const [activeSection, setActiveSection] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState({});
  const [editLecture, setEditLecture] = useState(null);
  const [showLectureDialog, setShowLectureDialog] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const fileInputRef = useRef(null);
  const bulkFileInputRef = useRef(null);

  const handleCourseChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value
    });
  };

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: `New Section`,
      lessons: []
    };
    
    setCourse({
      ...course,
      sections: [...course.sections, newSection]
    });
    
    setActiveSection(newSection.id);
  };

  const updateSection = (sectionId, title) => {
    setCourse({
      ...course,
      sections: course.sections.map(section => 
        section.id === sectionId ? { ...section, title } : section
      )
    });
  };

  const deleteSection = (sectionId) => {
    setCourse({
      ...course,
      sections: course.sections.filter(section => section.id !== sectionId)
    });
    
    if (activeSection === sectionId) {
      setActiveSection(null);
    }
  };

  const addLesson = (sectionId, type) => {
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: `New ${type} lesson`,
      type,
      content: "",
      duration: type === "video" ? 10 : undefined,
      quizQuestions: type === "quiz" ? [] : undefined,
      lectures: type === "video" ? [] : undefined
    };
    
    setCourse({
      ...course,
      sections: course.sections.map(section => 
        section.id === sectionId 
          ? { ...section, lessons: [...section.lessons, newLesson] } 
          : section
      )
    });

    if (type === "video") {
      setActiveLesson(newLesson.id);
    }
  };

  const updateLesson = (sectionId, lessonId, updates) => {
    setCourse({
      ...course,
      sections: course.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              lessons: section.lessons.map(lesson => 
                lesson.id === lessonId ? { ...lesson, ...updates } : lesson
              ) 
            } 
          : section
      )
    });
  };

  const deleteLesson = (sectionId, lessonId) => {
    setCourse({
      ...course,
      sections: course.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
            } 
          : section
      )
    });

    if (activeLesson === lessonId) {
      setActiveLesson(null);
    }
  };

  const getLessonById = (sectionId, lessonId) => {
    const section = course.sections.find(s => s.id === sectionId);
    if (!section) return undefined;
    return section.lessons.find(l => l.id === lessonId);
  };

  const addLecture = (sectionId, lessonId, lecture) => {
    const lesson = getLessonById(sectionId, lessonId);
    if (!lesson || lesson.type !== "video") return;

    const newLecture = {
      id: `lecture-${Date.now()}`,
      title: lecture.title || "New Lecture",
      videoUrl: lecture.videoUrl,
      duration: lecture.duration || 0,
      isFreePreview: lecture.isFreePreview || false
    };

    updateLesson(sectionId, lessonId, {
      lectures: [...(lesson.lectures || []), newLecture]
    });

    toast.success("Lecture added successfully");
    setShowLectureDialog(false);
  };

  const updateLecture = (sectionId, lessonId, lectureId, updates) => {
    const lesson = getLessonById(sectionId, lessonId);
    if (!lesson || lesson.type !== "video" || !lesson.lectures) return;

    const updatedLectures = lesson.lectures.map(lecture => 
      lecture.id === lectureId ? { ...lecture, ...updates } : lecture
    );

    updateLesson(sectionId, lessonId, { lectures: updatedLectures });
    toast.success("Lecture updated successfully");
    setShowLectureDialog(false);
    setEditLecture(null);
  };

  const deleteLecture = (sectionId, lessonId, lectureId) => {
    const lesson = getLessonById(sectionId, lessonId);
    if (!lesson || lesson.type !== "video" || !lesson.lectures) return;

    const updatedLectures = lesson.lectures.filter(lecture => lecture.id !== lectureId);
    updateLesson(sectionId, lessonId, { lectures: updatedLectures });
    toast.success("Lecture deleted successfully");
  };

  const toggleFreePreview = (sectionId, lessonId, lectureId) => {
    const lesson = getLessonById(sectionId, lessonId);
    if (!lesson || lesson.type !== "video" || !lesson.lectures) return;

    const lecture = lesson.lectures.find(l => l.id === lectureId);
    if (!lecture) return;

    updateLecture(sectionId, lessonId, lectureId, { isFreePreview: !lecture.isFreePreview });
    toast.success(`Lecture is now ${lecture.isFreePreview ? 'not ' : ''}available as free preview`);
  };

  const handleOpenLectureModal = (sectionId, lessonId, lecture) => {
    setCurrentSectionId(sectionId);
    setCurrentLessonId(lessonId);
    setEditLecture(lecture || null);
    setShowLectureDialog(true);
  };

  const simulateFileUpload = (lectureId) => {
    setIsUploading(prev => ({ ...prev, [lectureId]: true }));
    setUploadProgress(prev => ({ ...prev, [lectureId]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[lectureId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsUploading(prevUploading => ({ ...prevUploading, [lectureId]: false }));
          toast.success("Video uploaded successfully");
          return { ...prev, [lectureId]: 100 };
        }
        return { ...prev, [lectureId]: currentProgress + 10 };
      });
    }, 500);
  };

  const handleFileChange = (event, lectureId) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      simulateFileUpload(lectureId);
      
      toast.info(`Uploading ${file.name}`);
    }
  };

  const handleBulkUpload = (event, sectionId, lessonId) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      
      const newLectures = [];
      
      files.forEach((file, index) => {
        const newLecture = {
          id: `lecture-${Date.now()}-${index}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          isFreePreview: false,
          duration: 10
        };
        
        simulateFileUpload(newLecture.id);
        
        newLectures.push(newLecture);
      });
      
      const lesson = getLessonById(sectionId, lessonId);
      if (lesson && lesson.type === "video") {
        updateLesson(sectionId, lessonId, {
          lectures: [...(lesson.lectures || []), ...newLectures]
        });
        
        setActiveSection(sectionId);
        setActiveLesson(lessonId);
      }
      
      toast.success(`Uploading ${files.length} lectures`);
    }
    
    if (bulkFileInputRef.current) {
      bulkFileInputRef.current.value = '';
    }
  };

  const handleSaveCourse = () => {
    if (!course.title.trim()) {
      toast.error("Course title is required");
      return;
    }
    
    if (onSave) {
      onSave(course);
    }
    
    toast.success("Course saved successfully");
  };

  const isLectureFormValid = (lecture) => {
    return lecture && lecture.title && lecture.title.trim() !== "";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Add the basic information about your course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Course Title</label>
            <Input
              id="title"
              name="title"
              value={course.title}
              onChange={handleCourseChange}
              placeholder="e.g., Introduction to JavaScript"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Course Description</label>
            <Textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleCourseChange}
              placeholder="Describe what students will learn in this course"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>Organize your course into sections and lessons</CardDescription>
          </div>
          <Button onClick={addSection} size="sm">
            <Plus size={16} className="mr-1" /> Add Section
          </Button>
        </CardHeader>
        <CardContent>
          {course.sections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Your course has no sections yet. Click "Add Section" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {course.sections.map((section) => (
                <Card key={section.id} className={`border ${activeSection === section.id ? 'border-fidel-500' : ''}`}>
                  <CardHeader className="py-3 flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, e.target.value)}
                        className="font-semibold h-8"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                      >
                        {activeSection === section.id ? 'Collapse' : 'Expand'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteSection(section.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>

                  {activeSection === section.id && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {section.lessons.map((lesson) => (
                          <div key={lesson.id} className="border rounded-md">
                            <div 
                              className="flex items-center justify-between p-3"
                            >
                              <div className="flex items-center space-x-3">
                                {lesson.type === 'video' && <Video className="text-blue-500" size={20} />}
                                {lesson.type === 'quiz' && <FileText className="text-green-500" size={20} />}
                                {lesson.type === 'text' && <FileText className="text-yellow-500" size={20} />}
                                
                                <div>
                                  <div className="font-medium">{lesson.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {lesson.type} {lesson.duration && `• ${lesson.duration} min`}
                                    {lesson.type === 'video' && lesson.lectures && ` • ${lesson.lectures.length} lectures`}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setActiveLesson(activeLesson === lesson.id ? null : lesson.id)}
                                >
                                  {activeLesson === lesson.id ? 'Collapse' : 'Expand'}
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Edit size={16} />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>Edit Lesson</DialogTitle>
                                      <DialogDescription>
                                        Update the details for this lesson
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div>
                                        <label className="block text-sm font-medium mb-1">Lesson Title</label>
                                        <Input
                                          value={lesson.title}
                                          onChange={(e) => updateLesson(section.id, lesson.id, { title: e.target.value })}
                                          placeholder="Lesson Title"
                                        />
                                      </div>
                                      
                                      {lesson.type === 'video' && (
                                        <>
                                          <div>
                                            <label className="block text-sm font-medium mb-1">Video Duration (minutes)</label>
                                            <Input
                                              type="number"
                                              value={lesson.duration}
                                              onChange={(e) => updateLesson(section.id, lesson.id, { duration: parseInt(e.target.value) })}
                                              placeholder="Duration in minutes"
                                            />
                                          </div>
                                        </>
                                      )}
                                      
                                      {lesson.type === 'text' && (
                                        <div>
                                          <label className="block text-sm font-medium mb-1">Content</label>
                                          <Textarea
                                            value={lesson.content}
                                            onChange={(e) => updateLesson(section.id, lesson.id, { content: e.target.value })}
                                            placeholder="Enter lesson content"
                                            rows={5}
                                          />
                                        </div>
                                      )}

                                      {lesson.type === 'quiz' && (
                                        <div>
                                          <label className="block text-sm font-medium mb-1">Quiz Questions</label>
                                          <MultipleChoiceQuiz
                                            initialQuestions={lesson.quizQuestions || []}
                                            onChange={(questions) => 
                                              updateLesson(section.id, lesson.id, { quizQuestions: questions })
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => deleteLesson(section.id, lesson.id)}
                                  className="text-red-500"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>

                            {activeLesson === lesson.id && lesson.type === 'video' && (
                              <div className="p-3 pt-0 border-t mt-3">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-sm font-semibold">Lectures</h4>
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleOpenLectureModal(section.id, lesson.id)}
                                    >
                                      <Plus size={16} className="mr-1" /> Add Lecture
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => bulkFileInputRef.current?.click()}
                                    >
                                      <Upload size={16} className="mr-1" /> Bulk Upload
                                    </Button>
                                    <input
                                      type="file"
                                      ref={bulkFileInputRef}
                                      className="hidden"
                                      multiple
                                      onChange={(e) => handleBulkUpload(e, section.id, lesson.id)}
                                    />
                                  </div>
                                </div>
                                
                                {(!lesson.lectures || lesson.lectures.length === 0) ? (
                                  <div className="text-center py-4 text-muted-foreground">
                                    No lectures added yet. Click "Add Lecture" to add content.
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {lesson.lectures.map((lecture, index) => (
                                      <div key={lecture.id} className="flex items-center justify-between p-2 border rounded-md">
                                        <div className="flex items-center gap-2">
                                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                                            {index + 1}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <div className="font-medium">{lecture.title}</div>
                                              {lecture.isFreePreview && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                  Preview
                                                </span>
                                              )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {lecture.duration} min
                                              {isUploading[lecture.id] && (
                                                <span className="ml-2 text-blue-500">Uploading...</span>
                                              )}
                                            </div>
                                            {isUploading[lecture.id] && (
                                              <div className="mt-1 w-32">
                                                <Progress value={uploadProgress[lecture.id] || 0} className="h-1" />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-1">
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => toggleFreePreview(section.id, lesson.id, lecture.id)}
                                          >
                                            {lecture.isFreePreview ? <EyeOff size={16} /> : <Eye size={16} />}
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleOpenLectureModal(section.id, lesson.id, lecture)}
                                          >
                                            <Edit size={16} />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                          >
                                            <RefreshCw size={16} />
                                            <input
                                              type="file"
                                              ref={fileInputRef}
                                              className="hidden"
                                              accept="video/*"
                                              onChange={(e) => handleFileChange(e, lecture.id)}
                                            />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => deleteLecture(section.id, lesson.id, lecture.id)}
                                            className="text-red-500"
                                          >
                                            <Trash2 size={16} />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addLesson(section.id, 'video')}
                            className="w-full"
                          >
                            <Video size={16} className="mr-2" /> Add Video
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addLesson(section.id, 'quiz')}
                            className="w-full"
                          >
                            <FileText size={16} className="mr-2" /> Add Quiz
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addLesson(section.id, 'text')}
                            className="w-full"
                          >
                            <FileText size={16} className="mr-2" /> Add Text
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveCourse}>Save Course</Button>
        </CardFooter>
      </Card>

      <Dialog open={showLectureDialog} onOpenChange={setShowLectureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editLecture ? 'Edit Lecture' : 'Add New Lecture'}</DialogTitle>
            <DialogDescription>
              {editLecture ? 'Update lecture details' : 'Fill in the details for the new lecture'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lecture-title">Lecture Title *</Label>
              <Input
                id="lecture-title"
                value={editLecture?.title || ''}
                onChange={(e) => setEditLecture(prev => prev ? {...prev, title: e.target.value} : null)}
                placeholder="Enter lecture title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lecture-duration">Duration (minutes)</Label>
              <Input
                id="lecture-duration"
                type="number"
                value={editLecture?.duration || 0}
                onChange={(e) => setEditLecture(prev => prev ? {...prev, duration: Number(e.target.value)} : null)}
                placeholder="Duration in minutes"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="lecture-preview"
                checked={editLecture?.isFreePreview || false}
                onCheckedChange={(checked) => 
                  setEditLecture(prev => prev ? {...prev, isFreePreview: !!checked} : null)
                }
              />
              <label
                htmlFor="lecture-preview"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make available as free preview
              </label>
            </div>

            {!editLecture?.videoUrl && !editLecture?.id && (
              <div className="space-y-2">
                <Label htmlFor="lecture-video">Upload Video (optional)</Label>
                <Input
                  id="lecture-video"
                  type="file"
                  accept="video/*"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLectureDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (currentSectionId && currentLessonId && editLecture) {
                  if (editLecture.id) {
                    updateLecture(currentSectionId, currentLessonId, editLecture.id, editLecture);
                  } else {
                    addLecture(currentSectionId, currentLessonId, editLecture);
                  }
                }
              }}
              disabled={!isLectureFormValid(editLecture)}
            >
              {editLecture?.id ? 'Update' : 'Add'} Lecture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseBuilder;