import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, FileText, FileDown, Check, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock transactions data
  const transactions = [
    { 
      id: "TX-12345",
      date: "2023-05-20",
      student: "Alex Johnson",
      course: "Introduction to React",
      amount: 49.99,
      instructor: "David Chen",
      status: "completed"
    },
    { 
      id: "TX-12346",
      date: "2023-05-19",
      student: "Emma Wilson",
      course: "Advanced JavaScript Patterns",
      amount: 79.99,
      instructor: "Lisa Wang",
      status: "completed"
    },
    { 
      id: "TX-12347",
      date: "2023-05-18",
      student: "Michael Brown",
      course: "UX Design Fundamentals",
      amount: 59.99,
      instructor: "Emily Rodriguez",
      status: "failed"
    },
    { 
      id: "TX-12348",
      date: "2023-05-17",
      student: "James Moore",
      course: "Digital Marketing Strategy",
      amount: 49.99,
      instructor: "Sarah Williams",
      status: "refunded"
    },
    { 
      id: "TX-12349",
      date: "2023-05-16",
      student: "Sophia Garcia",
      course: "Python for Data Science",
      amount: 69.99,
      instructor: "Michael Brown",
      status: "completed"
    },
  ];
  
  // Mock payout requests data
  const payoutRequests = [
    {
      id: "PO-5001",
      date: "2023-05-15",
      instructor: "David Chen",
      amount: 320.00,
      courses: 3,
      status: "pending"
    },
    {
      id: "PO-5002",
      date: "2023-05-10",
      instructor: "Lisa Wang",
      amount: 480.50,
      courses: 4,
      status: "approved"
    },
    {
      id: "PO-5003",
      date: "2023-05-08",
      instructor: "Emily Rodriguez",
      amount: 215.75,
      courses: 2,
      status: "completed"
    },
    {
      id: "PO-5004",
      date: "2023-05-05",
      instructor: "Sarah Williams",
      amount: 175.25,
      courses: 2,
      status: "pending"
    },
  ];
  
  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => 
    transaction.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter payout requests based on search query
  const filteredPayouts = payoutRequests.filter(payout => 
    payout.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payout.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleApprovePayout = (payoutId) => {
    toast.success(`Payout ${payoutId} has been approved`);
  };
  
  const handleRejectPayout = (payoutId) => {
    toast.error(`Payout ${payoutId} has been rejected`);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
      case "approved":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <Check size={12} className="mr-1" />
            {status === "completed" ? "Completed" : "Approved"}
          </span>
        );
      case "failed":
      case "rejected":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <X size={12} className="mr-1" />
            {status === "failed" ? "Failed" : "Rejected"}
          </span>
        );
      case "refunded":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Check size={12} className="mr-1" />
            Refunded
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertCircle size={12} className="mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
        <CardDescription>Manage transactions and instructor payouts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactions" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="payouts">Instructor Payouts</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  className="pl-9 w-full md:w-64" 
                  placeholder={activeTab === "transactions" ? "Search transactions..." : "Search payouts..."} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon">
                <FileDown size={16} />
              </Button>
              <Button variant="outline">
                <FileText size={16} className="mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
          
          <TabsContent value="transactions" className="mt-0">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.student}</TableCell>
                      <TableCell>{transaction.course}</TableCell>
                      <TableCell className="font-mono">${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.instructor}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="payouts" className="mt-0">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                      <TableCell>{payout.date}</TableCell>
                      <TableCell>{payout.instructor}</TableCell>
                      <TableCell className="font-mono">${payout.amount.toFixed(2)}</TableCell>
                      <TableCell>{payout.courses}</TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell>
                        {payout.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="h-8 bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprovePayout(payout.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                              onClick={() => handleRejectPayout(payout.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {payout.status !== "pending" && (
                          <Button variant="outline" size="sm" className="h-8">
                            <FileText size={14} className="mr-1" />
                            Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {activeTab === "transactions" ? (
            <>Showing <span className="font-medium">{filteredTransactions.length}</span> of <span className="font-medium">{transactions.length}</span> transactions</>
          ) : (
            <>Showing <span className="font-medium">{filteredPayouts.length}</span> of <span className="font-medium">{payoutRequests.length}</span> payout requests</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentManagement;