import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const CourseModeration = () => {
  const [activeTab, setActiveTab] = useState("pending");
  
  // Mock course data
  const courses = [
    { 
      id: 1, 
      title: "Introduction to React", 
      instructor: "David Chen", 
      category: "Web Development", 
      submittedDate: "2023-05-15", 
      status: "pending",
      lessons: 12,
      duration: "6 hours"
    },
    { 
      id: 2, 
      title: "Advanced JavaScript Patterns", 
      instructor: "Lisa Wang", 
      category: "Programming", 
      submittedDate: "2023-05-10", 
      status: "approved",
      lessons: 8,
      duration: "4.5 hours"
    },
    { 
      id: 3, 
      title: "UX Design Fundamentals", 
      instructor: "Emily Rodriguez", 
      category: "Design", 
      submittedDate: "2023-05-12", 
      status: "pending",
      lessons: 10,
      duration: "5 hours"
    },
    { 
      id: 4, 
      title: "Python for Data Science", 
      instructor: "Michael Brown", 
      category: "Data Science", 
      submittedDate: "2023-05-08", 
      status: "rejected",
      lessons: 15,
      duration: "8 hours"
    },
    { 
      id: 5, 
      title: "Digital Marketing Strategy", 
      instructor: "Sarah Williams", 
      category: "Marketing", 
      submittedDate: "2023-05-05", 
      status: "approved",
      lessons: 9,
      duration: "4 hours"
    },
  ];
  
  const filteredCourses = courses.filter(course => {
    if (activeTab === "all") return true;
    return course.status === activeTab;
  });
  
  const handleApproveCourse = (courseId) => {
    toast.success(`Course #${courseId} has been approved`);
  };
  
  const handleRejectCourse = (courseId) => {
    toast.error(`Course #${courseId} has been rejected`);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle size={12} className="mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Course Moderation</CardTitle>
        <CardDescription>Review and approve courses before they go live</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="all">All Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Lessons</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>#{course.id}</TableCell>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>{course.lessons} ({course.duration})</TableCell>
                      <TableCell>{course.submittedDate}</TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8">
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          
                          {course.status === "pending" && (
                            <>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="h-8 bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveCourse(course.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                                onClick={() => handleRejectCourse(course.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredCourses.length}</span> of <span className="font-medium">{courses.length}</span> courses
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseModeration;