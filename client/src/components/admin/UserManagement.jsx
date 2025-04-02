import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock user data
  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "student",
      status: "Active",
      createdAt: "2023-01-15",
      bio: "Computer Science student with focus on web development",
      lastLogin: "2023-06-10 14:30",
      coursesEnrolled: 5,
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "student",
      status: "Active",
      createdAt: "2023-02-20",
      bio: "Mathematics major interested in data science",
      lastLogin: "2023-06-12 09:15",
      coursesEnrolled: 3,
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      role: "student",
      status: "Inactive",
      createdAt: "2023-03-10",
      bio: "Former student, now working in industry",
      lastLogin: "2023-05-01 11:20",
      coursesEnrolled: 2,
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily@example.com",
      role: "instructor",
      status: "Pending",
      createdAt: "2023-04-05",
      bio: "Professional web developer with 5 years experience",
      lastLogin: "2023-06-15 16:45",
      coursesTaught: 0,
    },
    {
      id: 5,
      name: "David Chen",
      email: "david@example.com",
      role: "instructor",
      status: "Active",
      createdAt: "2023-03-22",
      bio: "Senior software engineer and educator",
      lastLogin: "2023-06-14 08:10",
      coursesTaught: 4,
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa@example.com",
      role: "instructor",
      status: "Active",
      createdAt: "2023-02-18",
      bio: "UX/UI designer and frontend specialist",
      lastLogin: "2023-06-13 13:25",
      coursesTaught: 6,
    },
  ];

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.status === "Active") ||
      (filterStatus === "pending" && user.status === "Pending");

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleApproveUser = (userId) => {
    toast.success(`User #${userId} has been approved`);
    // In a real app, you would update the user status in your database/state
  };

  const handleRejectUser = (userId) => {
    toast.error(`User #${userId} has been rejected`);
    // In a real app, you would update the user status in your database/state
  };

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <UserCheck size={12} className="mr-1" />
            Active
          </span>
        );
      case "Inactive":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <UserX size={12} className="mr-1" />
            Inactive
          </span>
        );
      case "Pending":
        return (
          <span className="flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <MoreHorizontal size={12} className="mr-1" />
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
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage all users across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
          <Button
            variant={filterStatus === "all" ? "default" : "ghost"}
            onClick={() => setFilterStatus("all")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "ghost"}
            onClick={() => setFilterStatus("active")}
            className="whitespace-nowrap"
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "ghost"}
            onClick={() => setFilterStatus("pending")}
            className="whitespace-nowrap"
          >
            Pending
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-9 w-full md:w-64"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="instructor">Instructors</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter size={16} />
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers
                .sort((a, b) => {
                  if (a.role === "student" && b.role !== "student") return -1;
                  if (a.role !== "student" && b.role === "student") return 1;
                  if (a.status === "Active" && b.status !== "Active") return -1;
                  if (a.status !== "Active" && b.status === "Active") return 1;
                  return 0;
                })
                .map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell>#{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="capitalize">{user.role}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewUser(user.id)}
                          className="h-8 w-8"
                        >
                          <Eye size={16} />
                        </Button>

                        {user.status === "Pending" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApproveUser(user.id)}
                              className="h-8 w-8 text-green-600"
                            >
                              <UserCheck size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRejectUser(user.id)}
                              className="h-8 w-8 text-red-600"
                            >
                              <UserX size={16} />
                            </Button>
                          </>
                        ) : user.status === "Active" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRejectUser(user.id)}
                            className="h-8 w-8 text-red-600"
                          >
                            <UserX size={16} />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApproveUser(user.id)}
                            className="h-8 w-8 text-green-600"
                          >
                            <UserCheck size={16} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
          <span className="font-medium">{users.length}</span> users
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-fidel-50 dark:bg-slate-800"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserManagement;
