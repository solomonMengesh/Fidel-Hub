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
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, UserCheck, UserX, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  
  // Mock user data
  const users = [
    { id: 1, name: "John Smith", email: "john@example.com", role: "student", status: "Active", createdAt: "2023-01-15" },
    { id: 2, name: "Sarah Williams", email: "sarah@example.com", role: "student", status: "Active", createdAt: "2023-02-20" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", role: "student", status: "Inactive", createdAt: "2023-03-10" },
    { id: 4, name: "Emily Rodriguez", email: "emily@example.com", role: "instructor", status: "Pending", createdAt: "2023-04-05" },
    { id: 5, name: "David Chen", email: "david@example.com", role: "instructor", status: "Active", createdAt: "2023-03-22" },
    { id: 6, name: "Lisa Wang", email: "lisa@example.com", role: "instructor", status: "Active", createdAt: "2023-02-18" },
   ];
  
  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });
  
  const handleApproveUser = (userId) => {
    toast.success(`User #${userId} has been approved`);
  };
  
  const handleRejectUser = (userId) => {
    toast.error(`User #${userId} has been rejected`);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage all users across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
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
                <SelectItem value="all">All Roles</SelectItem>
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>#{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                      user.status === "Inactive" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : 
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.status === "Pending" && (
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
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={16} />
                      </Button>
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
          Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-fidel-50 dark:bg-slate-800">
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