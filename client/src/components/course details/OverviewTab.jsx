import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";

export const OverviewTab = ({ course, total }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Check if already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        console.log("🔍 Checking enrollment for:", user._id, course._id);

        const res = await axios.get(
          `http://localhost:5000/api/enrollments/check?studentId=${user._id}&courseId=${course._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Enrollment check response:", res.data);

        // Handle response structure { isEnrolled: true }
        if (res.data?.isEnrolled === true) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Enrollment check error:", error?.response?.data || error.message);
      }
    };

    if (user && course?._id) {
      checkEnrollment();
    }
  }, [user, course]);

  // Handle enrollment payment
  const handleEnroll = async () => {
    setLoading(true);
    try {
      if (!user?.email || !user?.name) {
        alert("Please log in to enroll.");
        return;
      }
      const res = await axios.post(
        "http://localhost:5000/api/payment/initiate",
        {
          amount: course.price,
          courseId: course._id,
          email: user.email,
          fullName: user.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data?.checkoutUrl) {
        window.location.replace(res.data.checkoutUrl);
      } else {
        alert("Payment initiation failed.");
      }
    } catch (error) {
      console.error("Enrollment error:", error?.response?.data || error.message);
      alert("Enrollment failed: " + (error?.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">About This Course</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p>{course.description}</p>
          </div>
        </div>

        {course.whatYouWillLearn && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.whatYouWillLearn.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check size={18} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {course.requirements && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Requirements</h3>
            <ul className="space-y-2">
              {course.requirements.map((item, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight size={18} className="mr-2 text-fidel-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sticky top-4">
          <h3 className="font-semibold mb-4">Course Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Level</span>
              <span className="font-medium">{course.level || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">{course.category || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium">ETB {course.price?.toLocaleString() || "Free"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">
                {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Duration</span>
              <span className="font-medium">{course.totalDuration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Lessons</span>
              <span className="font-medium">{total}</span>
            </div>
          </div>
          {!isEnrolled && (
            <div className="border-t border-slate-200 dark:border-slate-800 mt-5 pt-5">
              <Button
                className="w-full"
                onClick={handleEnroll}
                disabled={loading}
              >
                {loading ? "Processing..." : "Enroll Now"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};