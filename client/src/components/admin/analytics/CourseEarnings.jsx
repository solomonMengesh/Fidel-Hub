import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
<<<<<<< HEAD
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const revenueData = [
  { name: "Course Sales", value: 65, amount: 156000 },
  { name: "Subscriptions", value: 25, amount: 60000 },
  { name: "Certificates", value: 10, amount: 24000 },
];

const CourseEarnings = ({ paymentMethod }) => {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">Revenue & Transactions</CardTitle>
        <CardDescription>
          Revenue breakdown by transaction type (via{" "}
          {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const amount = props.payload.amount;
                    return [`${value}% (ETB ${amount.toLocaleString()})`, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 h-full">
            <div className="space-y-4 p-4">
              <div className="text-center md:text-left mb-6">
                <div className="text-2xl font-bold">ETB 240,000</div>
                <div className="text-sm text-muted-foreground">
                  Total Revenue
                </div>
              </div>
              {revenueData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{item.name}</span>
                  </div>   
                  <div className="font-medium">
                    ETB {item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
=======
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const revenueGrowthData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 25000 },
  { month: "Apr", revenue: 30000 },
  { month: "May", revenue: 40000 },
  { month: "Jun", revenue: 52000 },
  { month: "Jul", revenue: 60000 },
];

const RevenueGrowth = () => {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">Revenue Growth</CardTitle>
        <CardDescription>
          Monthly revenue growth trend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `ETB ${value / 1000}k`} />
              <Tooltip
                formatter={(value) => `ETB ${value.toLocaleString()}`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
>>>>>>> d1f6c4b020c701144d6cf2bca5c410e71745af98
        </div>
      </CardContent>
    </Card>
  );
};

<<<<<<< HEAD
export default CourseEarnings;
=======
export default RevenueGrowth;
>>>>>>> d1f6c4b020c701144d6cf2bca5c410e71745af98
