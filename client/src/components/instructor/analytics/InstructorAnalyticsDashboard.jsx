import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudentEnrollmentsPerCourse from "./StudentEnrollmentsPerCourse";
import StudentProgressCompletion from "./StudentProgressCompletion";
import CourseRatingsFeedback from "./CourseRatingsFeedback";
import CourseEarnings from "./CourseEarnings";

const InstructorAnalyticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Month");
  const [paymentMethod, setPaymentMethod] = useState("chapa");

  // Sample data
  const studentData = [
    { name: "Web Development", value: 35 },
    { name: "Data Science", value: 25 },
    { name: "Design", value: 20 },
    { name: "Business", value: 15 },
    { name: "Marketing", value: 5 },
  ];

  const completionData = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 125 },
    { month: "Mar", value: 135 },
    { month: "Apr", value: 142 },
    { month: "May", value: 156 },
    { month: "Jun", value: 170 },
  ];

  const ratingData = [
    { course: "Web Development", rating: 4.8 },
    { course: "Data Science", rating: 4.5 },
    { course: "Design", rating: 4.7 },
    { course: "Business", rating: 4.3 },
    { course: "Marketing", rating: 4.6 },
  ];

  const earningsData = [
    { month: "Jan", value: 1200 },
    { month: "Feb", value: 1350 },
    { month: "Mar", value: 1480 },
    { month: "Apr", value: 1650 },
    { month: "May", value: 1820 },
    { month: "Jun", value: 2100 },
  ];

  const feedbackData = [
    {
      student: "Kidus Abebe",
      course: "Web Development",
      rating: 5,
      comment: "ጥሩ ትምህርት፣ በጣም ረድቶኛል።",
      date: "2 days ago",
    },
    {
      student: "Hana Bekele",
      course: "Data Science",
      rating: 4,
      comment:
        "Very informative course, but could use more practical examples.",
      date: "1 week ago",
    },
    {
      student: "Dawit Mekonnen",
      course: "Design",
      rating: 5,
      comment: "Excellent course structure and content!",
      date: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Instructor Analytics Dashboard</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chapa">Chapa</SelectItem>
                <SelectItem value="telebirr">TeleBirr</SelectItem>
                <SelectItem value="all">All Methods</SelectItem>
              </SelectContent>
            </Select> */}

            {/* <div className="flex space-x-2">
              {["Week", "Month", "Quarter", "Year"].map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StudentEnrollmentsPerCourse
          data={studentData}
          timeRange={selectedTimeRange}
        />
        <StudentProgressCompletion
          data={completionData}
          timeRange={selectedTimeRange}
        />
        <CourseRatingsFeedback
          ratingData={ratingData}
          feedbackData={feedbackData}
        />
        <CourseEarnings
          data={earningsData}
          paymentMethod={paymentMethod}
          timeRange={selectedTimeRange}
        />
      </div>
    </div>
  );
};

export default InstructorAnalyticsDashboard;
