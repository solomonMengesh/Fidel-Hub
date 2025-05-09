import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  PieChart,
  Users,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");
  const [error, setError] = useState(null);

  const getDateRange = (filter) => {
    const now = new Date();
    let start, end = now;

    switch (filter) {
        case "7d":
        start = new Date();
        start.setDate(now.getDate() - 7);
        break;
      case "30d":
        start = new Date();
        start.setDate(now.getDate() - 30);
        break;
      case "90d":
        start = new Date();
        start.setDate(now.getDate() - 90);
        break;
      case "ytd":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return {};
    }

    return {
      startDate: start.toISOString(),
      endDate: new Date().toISOString()
    };
  };

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);

      const { startDate, endDate } = getDateRange(dateFilter);
      const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : "";

      const response = await axios.get(
        `http://localhost:5000/api/withdrawals/InstructorEarnings${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEarningsData(response.data);
    } catch (error) {
      toast.error("Failed to fetch earnings data");
      console.error("Earnings fetch error:", error);
      setError("Failed to load earnings data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [dateFilter]);

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
            Instructor Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your course performance and earnings
          </p>
        </div>
        <Select onValueChange={handleDateFilterChange} defaultValue="all">
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
            
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/30">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl group hover:shadow-teal-100 dark:hover:shadow-teal-900/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Earnings
                </CardTitle>
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40">
                  <DollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {earningsData?.summary.totalInstructorEarnings.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'ETB'
                  })}
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+12% from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl group hover:shadow-blue-100 dark:hover:shadow-blue-900/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Platform Revenue
                </CardTitle>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40">
                  <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {earningsData?.summary.totalPlatformRevenue.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'ETB'
                  })}
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Instructor Share</span>
                    <span>80%</span>
                  </div>
                  <Progress value={70} className="h-2 bg-gray-200 dark:bg-gray-700" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl group hover:shadow-purple-100 dark:hover:shadow-purple-900/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Students
                </CardTitle>
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {earningsData?.perCourseRevenue.reduce((acc, course) => acc + course.studentCount, 0)}
                </div>
                <div className="flex items-center mt-2">
                  <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Across {earningsData?.perCourseRevenue.length} courses
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none bg-white dark:bg-gray-900 shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>
                  Earnings breakdown by course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {earningsData?.perCourseRevenue.map((course) => (
                    <div
                      key={course._id}
                      className="flex flex-col md:flex-row justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                          <BookOpen className="h-5 w-5 text-fidel-600 dark:text-fidel-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{course.courseName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-medium">{course.studentCount}</span> {course.studentCount === 1 ? 'student' : 'students'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:text-right">
                      <p className="text-lg font-semibold text-fidel-600 dark:text-teal-400">
  {course.totalEarnings.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ETB
</p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {((course.totalEarnings / course.totalPayments) * 100).toFixed(0)}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white dark:bg-gray-900 shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>
                  {dateFilter === "all" ? "All time" : 
                   dateFilter === "30d" ? "Last 30 days" :
                   dateFilter === "90d" ? "Last 90 days" : "Year to date"} overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Gross Revenue</span>
                    <span className="font-medium">
  {earningsData?.summary.totalReceived.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ETB
</span>

                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Your Earnings</span>
                    <span className="font-medium text-teal-600 dark:text-teal-400">
                      {earningsData?.summary.totalInstructorEarnings.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'ETB'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Platform Fee</span>
                    <span className="font-medium">
                      {earningsData?.summary.totalPlatformRevenue.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'ETB'
                      })}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Earnings Ratio</span>
                      <span className="font-medium">80/20</span>
                    </div>
                    <Progress 
                      value={70} 
                      className="h-2 mt-2 bg-gray-200 dark:bg-gray-700" 
                      indicatorClassName="bg-gradient-to-r from-teal-500 to-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;