// import React, { useState } from "react";
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription 
// } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Users, BookOpen, Award, Layers, DollarSign, Calendar } from "lucide-react";

// const PlatformAnalytics = () => {
//   const [timePeriod, setTimePeriod] = useState("30days");
  
//   // Mock data for platform statistics
//   const platformStats = [
//     { title: "Total Students", value: "1,245", icon: Users, change: "+12.5%" },
//      { title: "Total Instructors", value: "245", icon: Users, change: "+8.1%" },
//     { title: "Total Courses", value: "36", icon: BookOpen, change: "+4.3%" },
    
//     { title: "Total Revenue", value: "$50,000", icon: DollarSign, change: "+10%" },
    
//   ];

//   return (
//     <div className="space-y-6">
//       <Card className="shadow-sm">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <CardTitle>Platform Analytics</CardTitle>
//               <CardDescription>Comprehensive insights into platform performance</CardDescription>
//             </div>
            
//             <Tabs defaultValue="30days" onValueChange={(value) => setTimePeriod(value)}>
//               <TabsList>
//                 <TabsTrigger value="7days">7 Days</TabsTrigger>
//                 <TabsTrigger value="30days">30 Days</TabsTrigger>
//                 <TabsTrigger value="3months">3 Months</TabsTrigger>
//                 <TabsTrigger value="year">Year</TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//             {platformStats.map((stat) => (
//               <div 
//                 key={stat.title}
//                 className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
//                     <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
//                     <p className="text-xs text-green-500 mt-1">{stat.change} vs previous period</p>
//                   </div>
//                   <div className="p-2 rounded-lg bg-fidel-50 dark:bg-slate-800">
//                     <stat.icon size={18} className="text-fidel-500 dark:text-fidel-400" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {/* Data Sections */}
//           <div className="grid grid-cols-1 gap-6 mb-6">
//             {/* User Growth Section */}
//             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
//               <h3 className="text-sm font-semibold mb-4">User Growth</h3>
//               <div className="text-muted-foreground text-sm">
//                 User growth data will be displayed here for the selected time period ({timePeriod}).
//               </div>
//             </div>
            
//             {/* Course Enrollments Section */}
//             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
//               <h3 className="text-sm font-semibold mb-4">Course Enrollments by Category</h3>
//               <div className="text-muted-foreground text-sm">
//                 Course enrollment statistics will be displayed here.
//               </div>
//             </div>
            
//             {/* Revenue Breakdown Section */}
//             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
//               <h3 className="text-sm font-semibold mb-4">Revenue Breakdown</h3>
//               <div className="text-muted-foreground text-sm">
//                 Revenue distribution across different sources will be shown here.
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PlatformAnalytics;
// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Users,
//   BookOpen,
//   Layers,
//   DollarSign,
//   Calendar,
//   TrendingUp,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DatePicker } from "@/components/ui/date-picker";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import CourseEarnings from "./analytics/CourseEarnings";
// import CourseRatingsFeedback from "./analytics/CourseRatingsFeedback";
// import StudentProgressCompletion from "./analytics/StudentProgressCompletion";
// import StudentEnrollmentsPerCourse from "./analytics/StudentEnrollmentsPerCourse";

// const PlatformAnalytics = () => {
//   const [timePeriod, setTimePeriod] = useState("30days");
//   const [paymentMethod, setPaymentMethod] = useState("chapa");
//   const [startDate, setStartDate] = useState(undefined);
//   const [endDate, setEndDate] = useState(undefined);

//   // Mock data for user growth
//   const userGrowthData = [
//     { name: "Jan", students: 120, instructors: 8 },
//     { name: "Feb", students: 165, instructors: 12 },
//     { name: "Mar", students: 210, instructors: 15 },
//     { name: "Apr", students: 305, instructors: 20 },
//     { name: "May", students: 390, instructors: 24 },
//     { name: "Jun", students: 480, instructors: 30 },
//   ];

//   // Mock data for platform statistics
//   const platformStats = [
//     {
//       title: "Total Users",
//       value: "1,245",
//       icon: Users,
//       change: "+12.5%",
//       chart: "up",
//     },
//     {
//       title: "Total Instructors",
//       value: "36",
//       icon: BookOpen,
//       change: "+4.3%",
//       chart: "up",
//     },
//     {
//       title: "Total Courses",
//       value: "89",
//       icon: Layers,
//       change: "+7.8%",
//       chart: "up",
//     },
//     {
//       title: "Total Revenue",
//       value: "ETB 240,000",
//       icon: DollarSign,
//       change: "+18.2%",
//       chart: "up",
//     },
//   ];

//   const resetDateFilter = () => {
//     setStartDate(undefined);
//     setEndDate(undefined);
//   };

//   return (
//     <div className="space-y-6">
//       <Card className="shadow-sm">
//         <CardHeader>
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <CardTitle>Platform Analytics</CardTitle>
//               <CardDescription>
//                 Comprehensive insights into platform performance
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             {platformStats.map((stat, index) => (
//               <Card
//                 key={stat.title}
//                 className="border-none shadow-sm hover:shadow-md transition-shadow duration-200"
//               >
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-sm font-medium text-muted-foreground">
//                       {stat.title}
//                     </CardTitle>
//                     <div className="p-2 rounded-lg bg-fidel-50 dark:bg-slate-800">
//                       <stat.icon
//                         size={18}
//                         className="text-fidel-500 dark:text-fidel-400"
//                       />
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div>
//                     <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
//                     <div className="flex items-center gap-1 mt-1">
//                       <TrendingUp size={14} className="text-green-500" />
//                       <p className="text-xs text-green-500">
//                         {stat.change} vs previous period
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Main Analytics Components */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             <StudentEnrollmentsPerCourse />
//             <StudentProgressCompletion />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <CourseEarnings paymentMethod={paymentMethod} />
//             <CourseRatingsFeedback />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PlatformAnalytics;
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  BookOpen,
  Layers,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
=======

>>>>>>> d1f6c4b020c701144d6cf2bca5c410e71745af98
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import CourseEarnings from "./analytics/CourseEarnings";
import CourseRatingsFeedback from "./analytics/CourseRatingsFeedback";
import StudentProgressCompletion from "./analytics/StudentProgressCompletion";
import StudentEnrollmentsPerCourse from "./analytics/StudentEnrollmentsPerCourse";

const PlatformAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState("30days");
  const [paymentMethod, setPaymentMethod] = useState("chapa");
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  // Mock data for user growth
  const userGrowthData = [
    { name: "Jan", students: 120, instructors: 8 },
    { name: "Feb", students: 165, instructors: 12 },
    { name: "Mar", students: 210, instructors: 15 },
    { name: "Apr", students: 305, instructors: 20 },
    { name: "May", students: 390, instructors: 24 },
    { name: "Jun", students: 480, instructors: 30 },
  ];

  // Mock data for platform statistics
  const platformStats = [
    {
      title: "Total Users",
      value: "1,245",
      icon: Users,
      change: "+12.5%",
      chart: "up",
      dataKey: "students",
    },
    {
      title: "Total Instructors",
      value: "36",
      icon: BookOpen,
      change: "+4.3%",
      chart: "up",
      dataKey: "instructors",
    },
    {
      title: "Total Courses",
      value: "89",
      icon: Layers,
      change: "+7.8%",
      chart: "up",
      dataKey: "students",
    },
    {
      title: "Total Revenue",
      value: "ETB 240,000",
      icon: DollarSign,
      change: "+18.2%",
      chart: "up",
      dataKey: "students",
    },
  ];

  const resetDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                Comprehensive insights into platform performance
              </CardDescription>
            </div>

<<<<<<< HEAD
           {/* <div className="flex flex-col sm:flex-row gap-3">
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate && endDate
                      ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                      : "Date Range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-4 grid gap-4">
                    <div className="grid gap-2">
                      <div className="grid gap-1">
                        <label className="text-sm font-medium">
                          Start date
                        </label>
                        <DatePicker
                          selected={startDate}
                          onSelect={setStartDate}
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-sm font-medium">End date</label>
                        <DatePicker selected={endDate} onSelect={setEndDate} />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetDateFilter}
                      >
                        Reset
                      </Button>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chapa">Chapa</SelectItem>
                  <SelectItem value="telebirr">TeleBirr</SelectItem>
                  <SelectItem value="all">All Methods</SelectItem>
                </SelectContent>
              </Select>

              <Tabs
                defaultValue="30days"
                onValueChange={(value) => setTimePeriod(value)}
              >
                <TabsList>
                  <TabsTrigger value="7days">7 Days</TabsTrigger>
                  <TabsTrigger value="30days">30 Days</TabsTrigger>
                  <TabsTrigger value="3months">3 Months</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div> */}
=======
       
>>>>>>> d1f6c4b020c701144d6cf2bca5c410e71745af98
          </div>
        </CardHeader>  
        <CardContent>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {platformStats.map((stat, index) => (
              <Card
                key={stat.title}
                className="border-none shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-fidel-50 dark:bg-slate-800">
                      <stat.icon
                        size={18}
                        className="text-fidel-500 dark:text-fidel-400"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={14} className="text-green-500" />
                      <p className="text-xs text-green-500">
                        {stat.change} vs previous period
                      </p>
                    </div>
                  </div>
                  {/* Small Area Chart */}
                  <div className="mt-4 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={userGrowthData}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id={`colorStat${index}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#0d8df4"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#0d8df4"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey={stat.dataKey}
                          stroke="#0d8df4"
                          fill={`url(#colorStat${index})`}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Analytics Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <StudentEnrollmentsPerCourse />
            <StudentProgressCompletion />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CourseEarnings paymentMethod={paymentMethod} />
            <CourseRatingsFeedback />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformAnalytics;