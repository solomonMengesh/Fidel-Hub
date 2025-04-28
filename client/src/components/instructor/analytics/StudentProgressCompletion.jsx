<<<<<<< HEAD
import React from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> d1f6c4b020c701144d6cf2bca5c410e71745af98
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Award } from "lucide-react";
<<<<<<< HEAD

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"];

const StudentProgressCompletion = ({ data, timeRange }) => {
=======
import axios from "axios";

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"];

const StudentProgressCompletion = ({ timeRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axios.get("/api/graphs/student-progress-completion", {
          params: { timeRange },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching student progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [timeRange]);

>>>>>>> d1f6c4b020c701144d6cf2bca5c410e71745af98
  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
        <div>
          <CardTitle>Student Progress & Completion</CardTitle>
          <CardDescription>
            Percentage of students who completed course modules
          </CardDescription>
        </div>
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-fidel-50 dark:bg-slate-800">
          <Award className="h-5 w-5 text-fidel-600 dark:text-fidel-400" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] p-6">
<<<<<<< HEAD
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="month"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                label={(entry) => `${entry.month}: ${entry.value}`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium">
                          {`${payload[0].name}: ${payload[0].value} completions`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>  
          </ResponsiveContainer>
=======
          {loading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-medium">
                            {`${payload[0].name}: ${payload[0].value}%`}
                          </p>
                          <p className="text-sm">
                            {`Number of students: ${payload[0].payload.count}`}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
>>>>>>> d1f6c4b020c701144d6cf2bca5c410e71745af98
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProgressCompletion;
