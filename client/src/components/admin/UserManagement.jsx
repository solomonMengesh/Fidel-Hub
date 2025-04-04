import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { FaBan, FaUnlock } from "react-icons/fa";

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
  const [users, setUsers] = useState([]);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("No authentication token found");
          return;
        }
    
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/all-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        // Handle nested array case
        if (response.data?.users) {
          setUsers(response.data.users);
        } 
        // Fallback (invalid format)
        else {
          toast.error("Invalid API response format");
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load user data");
        setUsers([]);
      }
    };
    
    fetchUsers();
  }, []);

  // Filter users based on search query and role filter
  const filteredUsers = Array.isArray(users) 
  ? users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = filterRole === "all" || user.role === filterRole;
      
      // Normalize user status to lowercase for consistency
      const userStatus = user.status.toLowerCase();

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && userStatus === "active") ||
        (filterStatus === "pending" && userStatus === "pending");

      return matchesSearch && matchesRole && matchesStatus;
    })
  : [];


const handleApproveUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No authentication token found");
      return;
    }

    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/approve-instructor/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success(`User #${userId} has been approved`);
    // Optionally update user status locally or refetch data
  } catch (error) {
    console.error(`Error approving User #${userId}:`, error);
    toast.error(`Failed to approve User #${userId}`);
  }
};

const handleRejectUser = async (userId) => {
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      toast.error("No authentication token found");
      return;
    }

    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/reject-instructor/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      }
    );

    toast.error(`User #${userId} has been rejected`);
    // Update user status locally or refetch data
  } catch (error) {
    console.error("Error rejecting user:", error);
    toast.error("Failed to reject user");
  }
};



  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };


  const handleBlockUser = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/block/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Update state or UI accordingly
        toast.success('User blocked successfully');
      } else {
        alert(result.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while blocking the user');
    }
  };

  // Function to handle unblocking user
  const handleUnblockUser = async (userId) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/unblock/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert(response.data.message);
      // Update the UI, for example, by refetching users or directly updating the user's status in state
      setUsers(users.map(user => user._id === userId ? { ...user, blocked: false, status: 'active' } : user));
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Error unblocking user');
    }
  };

  // const getStatusBadge = (status) => {
  //   switch (status) {
  //     case "Active":
  //       return (
  //         <span className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
  //           <UserCheck size={12} className="mr-1" />
  //           Active
  //         </span>
  //       );
  //     case "Inactive":
  //       return (
  //         <span className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
  //           <UserX size={12} className="mr-1" />
  //           Inactive
  //         </span>
  //       );
  //     case "Pending":
  //       return (
  //         <span className="flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
  //           <MoreHorizontal size={12} className="mr-1" />
  //           Pending
  //         </span>
  //       );
  //     default:
  //       return null;
  //   }
  // };

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
                .map((user) => {
                  const userStatus = user.status.toLowerCase(); // Normalize status
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>#{user._id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="capitalize">{user.role}</span>
                      </TableCell>
                      <TableCell>{(user.status)}</TableCell>
                      {/* <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell> */}
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>

                      <TableCell>
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleViewUser(user._id)}
      className="h-8 w-8"
    >
      <Eye size={16} />
    </Button>

    {userStatus === "pending" && (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleApproveUser(user._id)}
          className="h-8 w-8 text-green-600"
        >
          <UserCheck size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRejectUser(user._id)}
          className="h-8 w-8 text-red-600"
        >
          <UserX size={16} />
        </Button>
      </>
    )}

    {/* Block/Unblock button for active or pending users */}
    {userStatus === "active" && !user.blocked && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleBlockUser(user._id)}
        className="h-8 w-8 text-yellow-600"
      >
        <FaBan  size={16} />
      </Button>
    )}

{user && user.status === "blocked" && (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => handleUnblockUser(user._id)}
    className="h-8 w-8 text-green-600"
  >
    <FaUnlock   size={16} />
  </Button>
)}

  </div>
</TableCell>

                    </TableRow>
                  );
                })}
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
