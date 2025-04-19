import { 
    ChevronRight, 
    Star, 
    Users, 
    Clock, 
    BookOpen,
    Award,
    MessageSquare 
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Link } from "react-router-dom";
  
  export const CourseHeader = ({ 
    course, 
    instructorName, 
    total, 
    totalDuration,
    onTryFreePreview,
    freeVideoLessons
  }) => {
    return (
      <div className="bg-fidel-600 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8 mt-8">
            <div className="flex-1">
              <div className="mb-4">
                <Link to="/courses" className="text-fidel-100 hover:text-white text-sm inline-flex items-center">
                  <ChevronRight size={16} className="rotate-180 mr-1" />
                  Back to Courses
                </Link>
              </div>
  
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-fidel-100 mb-6">{course.description?.split("\n\n")[0] || course.description}</p>
  
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Star size={18} className="text-yellow-300 fill-yellow-300 mr-1" />
                  <span className="font-medium">{course.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-fidel-200 ml-1">({course.totalRatings?.toLocaleString() || 0} ratings)</span>
                </div>
                <div className="flex items-center">
                  <Users size={18} className="mr-1" />
                  <span>{(course.students || 0).toLocaleString()} students</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-1" />
                  <span>{course.totalDuration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={18} className="mr-1" />
                  <span>{total} lessons</span>
                </div>
              </div>
  
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-white/20 mr-3 flex items-center justify-center">
                  <span className="text-xl font-medium">
                    {instructorName.split(' ').map(n => n[0].toUpperCase()).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium">Created by {instructorName}</div>
                  <div className="text-sm text-fidel-200">
                    Last updated: {new Date(course.updatedAt || course.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
  
            <div className="md:w-96">
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src={course.thumbnail?.url || "https://placehold.co/800x500/34d399/ffffff.png?text=Course+Image"} 
                  alt={course.title} 
                  className="w-full h-52 object-cover" 
                />
                <div className="p-6">
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ETB {course.price?.toLocaleString() || 'Free'}
                    </span>
                  </div>
                  <Button className="w-full mb-3 bg-fidel-600 hover:bg-fidel-700">Enroll Now</Button>
                  <Button 
                    variant="outline" 
                    className="w-full mb-6 text-black"
                    onClick={onTryFreePreview}
                    disabled={freeVideoLessons.length === 0}
                  >
                    Try Free Preview
                    {freeVideoLessons.length === 0 && (
                      <span className="sr-only">(no free videos available)</span>
                    )}
                  </Button>
                  <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-muted-foreground" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center">
                      <Award size={16} className="mr-2 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare size={16} className="mr-2 text-muted-foreground" />
                      <span>Direct instructor support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };