import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Download,
  Mail,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/layout/UserAvatar";
import axios from "axios";

const UserDetail = ({ userId, onBack, embedded = false }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error("Axios error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDownload = (fileUrl) => {
    const filePath = `${import.meta.env.VITE_API_BASE_URL}/uploads/cvs/${fileUrl
      .split(/[\\/]/)
      .pop()}`;
    const newWindow = window.open(filePath, "_blank", "width=800,height=600");
    if (!newWindow) {
      toast.error(
        "Failed to open the file. Please disable your pop-up blocker."
      );
      return;
    }
    toast.success("File opened in a new window");
  };

  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/admin/approve-instructor/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData((prev) => ({ ...prev, status: "active" }));
      toast.success(`User #${userId} has been approved`);
    } catch (error) {
      console.error(
        `Error approving User #${userId}:`,
        error.response?.data || error.message
      );
      toast.error(`Failed to approve User #${userId}`);
    }
  };

  const handleRejectUser = async (user) => {
    const userId = user?._id;
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/admin/reject-instructor/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData((prev) => ({ ...prev, status: "blocked" }));
      toast.success(`User #${userId} has been rejected`);
    } catch (error) {
      console.error(
        "Error rejecting user:",
        error.response?.data || error.message
      );
      toast.error("Failed to reject user");
    }
  };

  const getUserInitials = () => {
    if (!userData?.name) return "";
    const nameParts = userData.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fidel-500"></div>
      </div>
    );
  }

  if (!userData) {
    return <div className="text-center">User not found</div>;
  }


  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Approved";
      case "blocked":
        return "Blocked";
      case "pending":
        return "Pending Approval";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={embedded ? "" : "container mx-auto py-8 px-4"}>
    {!embedded && (
      <div className="flex justify-start mb-6">
      <Button variant="ghost" onClick={onBack}>
        <ChevronLeft size={16} className="mr-2" />
        Back to User Management
      </Button>
    </div>
    
    )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24">
                <UserAvatar getUserInitials={getUserInitials} />
              </div>
            </div>
            <CardTitle>{userData.name}</CardTitle>
            <CardDescription>
              <span className="capitalize">{userData.role}</span>
              <div className="flex items-center justify-center mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    userData.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : userData.status === "blocked"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {getStatusLabel(userData.status)}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail size={16} className="text-muted-foreground mr-2" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-muted-foreground mr-2" />
                <span>
                  Joined {new Date(userData.createdAt).toLocaleDateString()}
                </span>
              </div>
              {userData.phone && (
                <div className="flex items-center">
                  <User size={16} className="text-muted-foreground mr-2" />
                  <span>{userData.phone}</span>
                </div>
              )}
            </div>

            <Separator className="my-6" />


            {userData.role === "instructor" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Documents</h3>
                {userData.cv && (
                  <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                    <div className="flex items-center">
                      <FileText
                        size={16}
                        className="text-muted-foreground mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {userData.cv.split("/").pop()}
                        </p>
                        <p className="text-xs text-muted-foreground">CV</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(userData.cv)}
                      className="h-8 w-8"
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {userData.status === "pending" ? (
              <>
                <Button
                  className="w-full flex items-center"
                  onClick={() => handleApproveUser(userData._id)}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve User
                </Button>
                <Button
                  variant="destructive"
                  className="w-full flex items-center"
                  onClick={() => handleRejectUser(userData)}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject User
                </Button>
              </>
            ) : null}
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Complete profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                {userData.role === "instructor" && (
                  <TabsTrigger value="expertise">Expertise</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                {userData.bio && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Bio</h3>
                    <p className="text-sm text-muted-foreground">
                      {userData.bio}
                    </p>
                  </div>
                )}
                {userData.address && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {userData.address}
                    </p>
                  </div>
                )}
              </TabsContent>

              {userData.role === "instructor" && (
                <TabsContent value="expertise">
                  <div className="space-y-4">
                    {userData.expertise && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">
                          Areas of Expertise
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {userData.expertise}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
