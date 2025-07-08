import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Eye, XCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const CourseModeration = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (activeTab === "all") return true;
    return activeTab === "active" ? course.isActive : !course.isActive;
  });

  const handleToggleVisibility = async (courseId, currentStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/visibility/${courseId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCourses((prev) =>
        prev.map((course) =>
          course._id === courseId
            ? { ...course, isActive: !currentStatus }
            : course
        )
      );

      toast.success(data.message);
    } catch (error) {
      toast.error("Failed to update course visibility");
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle size={12} className="mr-1" />
        Active
      </span>
    ) : (
      <span className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
        <XCircle size={12} className="mr-1" />
        Inactive
      </span>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Course Moderation</CardTitle>
        <CardDescription>
          Manage course visibility on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="all">All Courses</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-md border overflow-hidden">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading courses...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
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
                      <TableRow key={course._id}>
                        <TableCell>#{course._id.slice(-5)}</TableCell>
                        <TableCell className="font-medium">
                          {course.title}
                        </TableCell>
                        <TableCell>{course.instructor?.name || "N/A"}</TableCell>
                        <TableCell>{course.category || "N/A"}</TableCell>
                        <TableCell>
                          {course.total || 0} ({course.totalDuration || "N/A"})
                        </TableCell>
                        <TableCell>
                          {new Date(course.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(course.isActive)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button variant="outline" size="sm" className="h-8">
                              <Eye size={14} className="mr-1" />
                              View
                            </Button>

                            <Button
                              size="sm"
                              variant={
                                course.isActive ? "destructive" : "default"
                              }
                              className="h-8"
                              onClick={() =>
                                handleToggleVisibility(course._id, course.isActive)
                              }
                            >
                              {course.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredCourses.length}</span>{" "}
          of <span className="font-medium">{courses.length}</span> courses
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseModeration;
