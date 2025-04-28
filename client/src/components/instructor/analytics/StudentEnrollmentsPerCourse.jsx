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
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

const StudentEnrollmentsPerCourse = ({ timeRange }) => {
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [totalEnrollments, setTotalEnrollments] = useState(0);

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

  // Opacity sequence shifted to start from 1
  const opacitySequence = [1, 1.75, 2.5, 3.25, 4]; // Adjusted from 0, 0.75, 1.5, 2.25, 3

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");
        const base =
          import.meta.env.VITE_REACT_APP_BASE_URL ||
          "http://localhost:5000";
        const url = `${base}/api/graphs/enrollments-per-course${
          timeRange ? `?range=${timeRange}` : ""
        }`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!Array.isArray(response.data)) {
          throw new Error("Unexpected response format");
        }

        // Add categories to data
        const dataWithCategories = response.data.map((item) => ({
          name: item.courseTitle,
          value: item.enrollments,
          category: item.category || mapCourseToCategory(item.courseTitle),
        }));

        // Calculate total enrollments
        const total = dataWithCategories.reduce((sum, item) => sum + item.value, 0);

        // Group by category for top-level chart
        const categoriesMap = {};
        categories.forEach((cat) => {
          categoriesMap[cat] = { category: cat, value: 0 };
        });
        dataWithCategories.forEach((item) => {
          categoriesMap[item.category].value += item.value;
        });

        // Filter out categories with no courses
        const filteredCategoryData = Object.values(categoriesMap).filter(
          (cat) => dataWithCategories.some((item) => item.category === cat.category)
        );

        setData(dataWithCategories);
        setCategoryData(filteredCategoryData);
        setTotalEnrollments(total);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [timeRange]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading…</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;

  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
        <div>
          <CardTitle>Student Enrollments per Course</CardTitle>
          <CardDescription>
            Total Enrollments: {totalEnrollments} across {data.length} courses
          </CardDescription>
        </div>
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-fidel-50 dark:bg-slate-800">
          <Users className="h-5 w-5 text-fidel-600 dark:text-fidel-400" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Top-Level Category Chart */}
        {categoryData.length > 0 ? (
          <div className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload && payload.length ? (
                      <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value} students`}</p>
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={`rgba(16, 185, 129, ${opacitySequence[idx % opacitySequence.length] / 4})`}
                    />
                  ))}
                  <LabelList dataKey="value" position="top" fill="#333" />
                </Bar>
            </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No enrollment data available.
          </div>
        )}

        {/* Category Bellows */}
        <div className="p-6 space-y-4">
          {categoryData.map((category, index) => {
            const coursesInCategory = data.filter(
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
                    <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.value} Enrollments
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
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={coursesInCategory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              content={({ active, payload }) =>
                                active && payload && payload.length ? (
                                  <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-lg border border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value} students`}</p>
                                  </div>
                                ) : null
                              }
                            />
                            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]}>
                              {coursesInCategory.map((entry, idx) => (
                                <Cell
                                  key={idx}
                                  fill={`rgba(16, 185, 129, ${opacitySequence[idx % opacitySequence.length] / 4})`}
                                />
                              ))}
                              <LabelList dataKey="value" position="top" fill="#333" />
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