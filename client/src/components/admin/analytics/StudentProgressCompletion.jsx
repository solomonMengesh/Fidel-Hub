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

const courseCompletionData = [
  { name: "Web Development", completed: 85, total: 100 },
  { name: "Data Science", completed: 72, total: 95 },
  { name: "Design", completed: 65, total: 80 },
  { name: "Marketing", completed: 58, total: 75 },
  { name: "Business", completed: 45, total: 60 },
];

const StudentProgressCompletion = () => {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">Course Completion Rates</CardTitle>
        <CardDescription>
          Percentage of students who completed each course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={courseCompletionData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                formatter={(value, name) => [`${value}%`, "Completion Rate"]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar
                dataKey="completed"
                name="Completion Rate (%)"
                fill="#06b6d4"
                radius={[0, 4, 4, 0]}
                barSize={20}
              >    
                {courseCompletionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(6, 182, 212, ${0.5 + index * 0.1})`}
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

export default StudentProgressCompletion;
