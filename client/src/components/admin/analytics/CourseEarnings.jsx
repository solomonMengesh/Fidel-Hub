import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const UserGrowth = () => {
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    const fetchUserGrowth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/analytics/user-growth");
        const data = await res.json();
        setGrowthData(data);
      } catch (err) {
        console.error("Failed to fetch user growth data:", err);
      }
    };

    fetchUserGrowth();
  }, []);

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">User Growth</CardTitle>
        <CardDescription>
          Monthly registration trend of students and instructors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#0d8df4"
                strokeWidth={2}
                name="Students"
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="instructors"
                stroke="#4CAF50"
                strokeWidth={2}
                name="Instructors"
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserGrowth;
