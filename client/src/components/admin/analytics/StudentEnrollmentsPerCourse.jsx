import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { ChevronDown, ChevronUp } from "lucide-react";

const StudentEnrollmentsPerCourse = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Define categories
  const categories = [
    'computer-science', 'programming', 'web-development', 'business', 'marketing',
    'data-science', 'psychology', 'finance', 'design', 'languages', 'health-fitness',
    'mathematics', 'photography', 'music', 'other', 'Machine Learning'
  ];

  // Map course titles to categories
  const mapCourseToCategory = (courseTitle) => {
    const title = courseTitle.toLowerCase();
    if (title.includes('react') || title.includes('web') || title.includes('javascript')) {
      return 'web-development';
    } else if (title.includes('programming') || title.includes('development')) {
      return 'programming';
    } else if (title.includes('computer') || title.includes('algorithm')) {
      return 'computer-science';
    } else if (title.includes('data') || title.includes('analytics')) {
      return 'data-science';
    } else if (title.includes('business') || title.includes('course creation')) {
      return 'business';
    } else if (title.includes('marketing')) {
      return 'marketing';
    } else if (title.includes('gpt') || title.includes('ai') || title.includes('machine learning')) {
      return 'Machine Learning';
    } else if (title.includes('psychology')) {
      return 'psychology';
    } else if (title.includes('finance') || title.includes('financial')) {
      return 'finance';
    } else if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
      return 'design';
    } else if (title.includes('language') || title.includes('english') || title.includes('spanish')) {
      return 'languages';
    } else if (title.includes('health') || title.includes('fitness')) {
      return 'health-fitness';
    } else if (title.includes('math') || title.includes('calculus')) {
      return 'mathematics';
    } else if (title.includes('photography')) {
      return 'photography';
    } else if (title.includes('music') || title.includes('guitar')) {
      return 'music';
    }
    return 'other';
  };

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/graphs/enrollments-per-course`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        

        // Add categories to enrollment data
        const dataWithCategories = response.data.map((item) => ({
          ...item,
          category: item.category || mapCourseToCategory(item.courseTitle),
        }));

        // Group by category for top-level chart
        const categoriesMap = {};
        categories.forEach((cat) => {
          categoriesMap[cat] = { category: cat, enrollments: 0 };
        });
        dataWithCategories.forEach((item) => {
          categoriesMap[item.category].enrollments += item.enrollments;
        });

        // Filter out categories with zero enrollments
        const filteredCategoryData = Object.values(categoriesMap).filter(
          (cat) => cat.enrollments > 0 || dataWithCategories.some((item) => item.category === cat.category)
        );

        setEnrollmentData(dataWithCategories);
        setCategoryData(filteredCategoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentData();
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">Student Enrollments per Course</CardTitle>
        <CardDescription>Number of students enrolled in each course by category</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Top-Level Category Chart */}
        {categoryData.length > 0 ? (
          <div className="h-72 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, "Enrollments"]}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="enrollments"
                  name="Number of Enrollments"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`rgba(136, 132, 216, ${0.5 + index * 0.05})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-500">
            No enrollment data available.
          </div>
        )}

        {/* Category Bellows */}
        <div className="space-y-4">
          {categoryData.map((category, index) => {
            const coursesInCategory = enrollmentData.filter(
              (item) => item.category === category.category
            );
            const isExpanded = expandedCategories[category.category];

            if (coursesInCategory.length === 0) return null;

            return (
              <div key={category.category} className="border rounded-lg">
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg font-semibold">
                    {`${index + 1}. ${category.category}`}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2 text-sm text-gray-500">
                      {category.enrollments} Enrollments
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </span>
                </button>
                {isExpanded && (
                  <div className="p-4">
                    {coursesInCategory.length > 0 ? (
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={coursesInCategory}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="courseTitle" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [value, "Enrollments"]}
                              labelFormatter={(label) => `Course: ${label}`}
                            />
                            <Bar
                              dataKey="enrollments"
                              name="Number of Enrollments"
                              fill="#8884d8"
                              radius={[4, 4, 0, 0]}
                            >
                              {coursesInCategory.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={`rgba(136, 132, 216, ${0.5 + index * 0.1})`}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center py-4">
                        No courses available in this category.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentEnrollmentsPerCourse;