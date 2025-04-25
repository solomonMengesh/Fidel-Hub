import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Download, MessageSquare, BarChart2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { Line } from "react-chartjs-2";
import { format } from 'date-fns';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentDetails = ({ selectedStudent, onBack, user }) => {
  const [activityLog, setActivityLog] = useState([]);
  const [progressHistory, setProgressHistory] = useState([]);
  const [message, setMessage] = useState("");

  // Update activity log and progress history when selectedStudent changes
  useEffect(() => {
    if (selectedStudent) {
      setActivityLog(selectedStudent.activityLog || []);
      setProgressHistory(selectedStudent.progressHistory || []);
    }
  }, [selectedStudent]);

  // Download PDF report
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Progress Report for ${selectedStudent.name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Email: ${selectedStudent.email}`, 20, 30);
    doc.text(`Course: ${selectedStudent.course}`, 20, 40);
    doc.text(`Progress: ${selectedStudent.progress}%`, 20, 50);
    doc.text(`Last Active: ${selectedStudent.lastActive}`, 20, 60);
    doc.text(`Enrollment Date: ${selectedStudent.enrollmentDate}`, 20, 70);
    doc.save(`${selectedStudent.name}_progress_report.pdf`);
    toast.success("Report downloaded successfully!");
  };

  // Send message to student
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          senderId: user._id,
          message,
        }),
      });
      toast.success(`Message sent to ${selectedStudent.name}!`);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  // Chart data for progress history
  const chartData = {
    labels: progressHistory.map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: "Progress (%)",
        data: progressHistory.map((entry) => entry.progress),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Progress Over Time" },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="text-fidel-500 hover:text-fidel-600 transition-colors"
        onClick={onBack}
      >
        <ChevronLeft size={16} className="mr-2" />
        Back to Student List
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Student Profile Card */}
        <div className="lg:w-1/3">
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="h-28 w-28 mx-auto rounded-full bg-gradient-to-br from-fidel-400 to-fidel-600 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                {selectedStudent.name?.charAt(0)}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
                {selectedStudent.name}
              </h3>
              <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
              <div className="mt-4 text-sm space-y-2">
                <p>
                  Enrolled in: <span className="font-medium">{selectedStudent.course}</span>
                </p>

                <p>
  Joined: <span className="font-medium">
    {selectedStudent.enrolledAt && !isNaN(new Date(selectedStudent.enrolledAt).getTime())
      ? format(new Date(selectedStudent.enrolledAt), 'yyyy-MM-dd') 
      : 'Invalid Date'}
  </span>
</p>




                <p className="flex items-center justify-center">
                  <Clock size={14} className="mr-1 text-muted-foreground" />
                  Last active {selectedStudent.lastActive}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full flex items-center justify-center gap-2"
                onClick={handleDownloadReport}
              >
                <Download size={16} />
                Download Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Student Details and Analytics */}
        <div className="lg:w-2/3 space-y-6">
          {/* Progress Card */}
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart2 size={20} />
                Completion Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fidel-500 to-fidel-600 rounded-full transition-all duration-500"
                    style={{ width: `${selectedStudent.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{selectedStudent.progress}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          {progressHistory.length > 0 && (
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Log */}
          {activityLog.length > 0 && (
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                  {activityLog.map((activity, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-sm border-b pb-2 last:border-b-0"
                    >
                      <div className="h-2 w-2 rounded-full bg-fidel-500"></div>
                      <span>
                        {activity.description} -{" "}
                        <span className="text-muted-foreground">
                          {new Date(activity.date).toLocaleString()}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Messaging */}
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare size={20} />
                Send Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:bg-slate-800 dark:border-slate-700"
                rows={4}
                placeholder="Write a message to the student..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <Button
                className="mt-3 bg-fidel-500 hover:bg-fidel-600 text-white"
                onClick={handleSendMessage}
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;