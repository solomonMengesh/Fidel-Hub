import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const enrollmentData = [
  { name: "Web Development", enrollments: 320 },
  { name: "Data Science", enrollments: 280 },
  { name: "Design", enrollments: 240 },
  { name: "Marketing", enrollments: 180 },
  { name: "Business", enrollments: 150 },
];

const StudentEnrollmentsPerCourse = () => {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">
          Student Enrollments per Course
        </CardTitle>
        <CardDescription>
          Number of students enrolled in each course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={enrollmentData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [value, "Enrollments"]}
                labelFormatter={(label) => `Course: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="enrollments"
                name="Number of Enrollments"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              >
                {enrollmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(136, 132, 216, ${0.5 + index * 0.1})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentEnrollmentsPerCourse;
