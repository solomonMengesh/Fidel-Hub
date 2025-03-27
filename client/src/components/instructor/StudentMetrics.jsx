import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Users, BookOpen, Clock, BarChart2 } from "lucide-react";

// Sample data
const enrollmentData = [
  { month: 'Jan', students: 24 },
  { month: 'Feb', students: 35 },
  { month: 'Mar', students: 42 },
  { month: 'Apr', students: 58 },
  { month: 'May', students: 67 },
  { month: 'Jun', students: 89 },
];

const completionData = [
  { name: 'Completed', value: 68 },
  { name: 'In Progress', value: 22 },
  { name: 'Not Started', value: 10 },
];

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

const topPerformers = [
  { id: 1, name: 'Sarah Wilson', progress: 98, course: 'Advanced JavaScript' },
  { id: 2, name: 'Michael Brown', progress: 95, course: 'React Fundamentals' },
  { id: 3, name: 'Jennifer Lee', progress: 92, course: 'Advanced JavaScript' },
  { id: 4, name: 'David Kim', progress: 89, course: 'React Fundamentals' },
  { id: 5, name: 'Emma Davis', progress: 87, course: 'Node.js Basics' },
];

const StudentMetrics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('This Month');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h3 className="text-2xl font-bold mt-1">345</h3>
              </div>
              <div className="p-3 rounded-lg bg-fidel-50 dark:bg-slate-800">
                <Users size={20} className="text-fidel-500 dark:text-fidel-400" />
              </div>
            </div>
            <div className="text-xs text-green-500 mt-2">+12% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                <h3 className="text-2xl font-bold mt-1">8</h3>
              </div>
              <div className="p-3 rounded-lg bg-fidel-50 dark:bg-slate-800">
                <BookOpen size={20} className="text-fidel-500 dark:text-fidel-400" />
              </div>
            </div>
            <div className="text-xs text-green-500 mt-2">+2 new this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Completion Time</p>
                <h3 className="text-2xl font-bold mt-1">14.5 days</h3>
              </div>
              <div className="p-3 rounded-lg bg-fidel-50 dark:bg-slate-800">
                <Clock size={20} className="text-fidel-500 dark:text-fidel-400" />
              </div>
            </div>
            <div className="text-xs text-red-500 mt-2">+2.3 days from avg</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <h3 className="text-2xl font-bold mt-1">68%</h3>
              </div>
              <div className="p-3 rounded-lg bg-fidel-50 dark:bg-slate-800">
                <BarChart2 size={20} className="text-fidel-500 dark:text-fidel-400" />
              </div>
            </div>
            <div className="text-xs text-green-500 mt-2">+5% from last month</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Student Enrollment</CardTitle>
                <CardDescription>Monthly enrollment statistics</CardDescription>
              </div>
              <div className="flex space-x-2">
                {['Week', 'Month', 'Year'].map((range) => (
                  <Button 
                    key={range} 
                    variant={selectedTimeRange.includes(range) ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedTimeRange(`This ${range}`)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={enrollmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Course Completion</CardTitle>
            <CardDescription>Student progress statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-full flex flex-col md:flex-row items-center">
                <ResponsiveContainer width="60%" height={250}>
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full md:w-[40%] space-y-3">
                  {completionData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Students</CardTitle>
          <CardDescription>Students with highest course completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((student) => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">{student.course}</p>
                  </div>
                  <div className="text-sm font-medium">{student.progress}%</div>
                </div>
                <Progress value={student.progress} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">View All Students</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMetrics;