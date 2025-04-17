import { Book, UploadCloud } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const categories = [
  "Computer Science",
  "Programming",
  "Web Development",
  "Business",
  "Marketing",
  "Data Science",
  "Psychology",
  "Finance",
  "Design",
  "Languages",
  "Health & Fitness",
  "Mathematics",
  "Photography",
  "Music",
  "Other",
];

const CourseDetailsTab = ({ form }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      form.setValue("courseImage", file);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setUploading(true);
      const formData = new FormData();
  
      // Append required fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("level", data.level);
      formData.append("category", data.category);
      formData.append("price", data.price);
  
      // Optional fields
      if (data.prerequisites) {
        formData.append("prerequisites", data.prerequisites);
      }
      if (data.technicalRequirements) {
        formData.append("technicalRequirements", data.technicalRequirements);
      }
  
      // Append course image if available
      if (data.courseImage) {
        formData.append("courseImage", data.courseImage);
      }
  
      const apiUrl = "http://localhost:5000/api/courses";
  
      // Post request to create the course
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // Uncomment if needed
        },
      });
  
      console.log("📦 Course created response:", response.data);
  
      // Check if the courseId is returned and handle accordingly
      if (response.data && response.data.courseId) {
        const createdCourseId = response.data.courseId; // Use courseId instead of _id
  
        // Save the created course ID in localStorage
        localStorage.setItem("createdCourseId", createdCourseId);
        console.log("✅ Course ID stored in localStorage:", createdCourseId);
  
        // Show toast notification on successful course creation
        toast({
          title: "Success",
          description: "Course created successfully!",
          variant: "default",
        });
      } else {
        // If the response doesn't contain a valid course ID, throw an error
        throw new Error("Course creation failed. No course ID returned.");
      }
  
    } catch (error) {
      console.error("❌ Error submitting course:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setUploading(false); // Reset uploading state when done
    }
  };
  
  
  

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          <Book className="inline mr-2" size={18} />
          Course Information
        </h3>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Advanced React Development" {...field} />
                </FormControl>
                <FormDescription>
                  A clear, specific title that describes what you'll teach
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your course in detail..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of what students will learn
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 49.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalLessons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Lessons</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Basic JavaScript knowledge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="technicalRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any technical requirements..."
                    className="min-h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Image</FormLabel>
                <FormControl>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600">
                        <label
                          htmlFor="course-image-upload"
                          className="relative cursor-pointer rounded-md font-medium text-fidel-600 hover:text-fidel-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="course-image-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-2 max-h-24 object-cover mx-auto"
                        />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={form.handleSubmit(handleSubmit)}
        disabled={uploading}
        className="mt-6 w-full py-2 px-4 bg-fidel-600 text-white rounded-md hover:bg-fidel-500 disabled:bg-slate-400"
      >
        {uploading ? "Uploading..." : "Save Course"}
      </button>
    </div>
  );
};

export default CourseDetailsTab;