import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Award, Layers, DollarSign, Calendar } from "lucide-react";

const PlatformAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState("30days");
  
  // Mock data for platform statistics
  const platformStats = [
    { title: "Total Students", value: "1,245", icon: Users, change: "+12.5%" },
     { title: "Total Instructors", value: "245", icon: Users, change: "+8.1%" },
    { title: "Total Courses", value: "36", icon: BookOpen, change: "+4.3%" },
    
    { title: "Total Revenue", value: "$50,000", icon: DollarSign, change: "+10%" },
    
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Comprehensive insights into platform performance</CardDescription>
            </div>
            
            <Tabs defaultValue="30days" onValueChange={(value) => setTimePeriod(value)}>
              <TabsList>
                <TabsTrigger value="7days">7 Days</TabsTrigger>
                <TabsTrigger value="30days">30 Days</TabsTrigger>
                <TabsTrigger value="3months">3 Months</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {platformStats.map((stat) => (
              <div 
                key={stat.title}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <p className="text-xs text-green-500 mt-1">{stat.change} vs previous period</p>
                  </div>
                  <div className="p-2 rounded-lg bg-fidel-50 dark:bg-slate-800">
                    <stat.icon size={18} className="text-fidel-500 dark:text-fidel-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Data Sections */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* User Growth Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
              <h3 className="text-sm font-semibold mb-4">User Growth</h3>
              <div className="text-muted-foreground text-sm">
                User growth data will be displayed here for the selected time period ({timePeriod}).
              </div>
            </div>
            
            {/* Course Enrollments Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
              <h3 className="text-sm font-semibold mb-4">Course Enrollments by Category</h3>
              <div className="text-muted-foreground text-sm">
                Course enrollment statistics will be displayed here.
              </div>
            </div>
            
            {/* Revenue Breakdown Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
              <h3 className="text-sm font-semibold mb-4">Revenue Breakdown</h3>
              <div className="text-muted-foreground text-sm">
                Revenue distribution across different sources will be shown here.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformAnalytics;