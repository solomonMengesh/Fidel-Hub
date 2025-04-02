import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Award,
  CheckCircle,
  XCircle,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/layout/UserAvatar";
import axios from "axios";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`
        );
        setUserData(response.data.user);
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleDownload = (fileName) => {
    // In a real app, this would trigger a download of the actual file
    // Here we're just showing a toast notification
    toast.success(`Downloading ${fileName}`);
  };

  const handleApproveUser = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${id}/approve`
      );
      toast.success(`User has been approved`);
      setUserData((prev) => ({ ...prev, approvalStatus: "approved" }));
    } catch (error) {
      toast.error("Failed to approve user");
      console.error(error);
    }
  };

  const handleRejectUser = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${id}/reject`
      );
      toast.error(`User has been rejected`);
      setUserData((prev) => ({ ...prev, approvalStatus: "rejected" }));
    } catch (error) {
      toast.error("Failed to reject user");
      console.error(error);
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
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fidel-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/admin-dashboard")}
      >
        <ChevronLeft size={16} className="mr-2" />
        Back to User Management
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
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
                    userData.approvalStatus === "approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : userData.approvalStatus === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {userData.approvalStatus === "approved"
                    ? "Approved"
                    : userData.approvalStatus === "rejected"
                    ? "Rejected"
                    : "Pending Approval"}
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
            {userData.approvalStatus === "pending" ? (
              <>
                <Button
                  className="w-full flex items-center"
                  onClick={handleApproveUser}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve User
                </Button>
                <Button
                  variant="destructive"
                  className="w-full flex items-center"
                  onClick={handleRejectUser}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject User
                </Button>
              </>
            ) : (
              <Button variant="outline" className="w-full">
                Send Message
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* User Details Tabs */}
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
                  <>
                    <TabsTrigger value="expertise">Expertise</TabsTrigger>
                  </>
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
