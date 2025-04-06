import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";

const PlatformSettings = () => {
  const [user, setUser] = useState({
    profilePic: "",
    name: "",
    email: "",
    bio: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user.profilePic);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your profile");
        return;
      }
  
      let userId;
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        userId = tokenPayload.id;
       } catch (error) {
        toast.error("Invalid token format");
        return;
      }
  
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`;
   
      try {
        setIsLoading(true);
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const userData = response.data;
        console.log("API Response:", userData);
        setUser(userData);
        setFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          bio: userData.bio || "",
        }));
        const fullProfilePicUrl = userData.profilePic && typeof userData.profilePic === 'string'
        ? `${userData.profilePic}` 
        : "/avatars/default-avatar.jpg";
  
      
         
           console.log("Profile Pic URL:", fullProfilePicUrl);
           setAvatarPreview(fullProfilePicUrl);
           console.log("Avatar Preview Set To:", fullProfilePicUrl);        console.log("Avatar Preview Set To:", fullProfilePicUrl);
      }  catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        console.log("API Response:", response.data);

        toast.error(error.response?.data?.message || error.message || "Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error("File size should be less than 2MB");
      return;
    }

    setIsAvatarLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setIsAvatarLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview("");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("bio", formData.bio);

    if (avatarPreview && avatarPreview !== user.profilePic) {
      // Convert data URL to Blob for file upload
      const blob = await (await fetch(avatarPreview)).blob();
      formDataToSend.append("profilePic", blob, "avatar.jpg");
      console.log("User profile pic:", user.profilePic);

    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIsLoading(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/profile/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      setIsLoading(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      toast.success("Password updated successfully!");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="page-container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="w-32 h-32">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Profile picture" />
                  ) : (
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                      {getInitials(formData?.name || user?.name || "User")}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isAvatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              <div className="w-full space-y-2">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 cursor-pointer"
                >
                  {avatarPreview ? "Change Avatar" : "Upload Avatar"}
                </label>

                {avatarPreview && (
                  <Button
                    variant="outline"
                    onClick={handleRemoveAvatar}
                    className="w-full"
                    disabled={isAvatarLoading}
                  >
                    Remove Avatar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your personal details and public profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your email address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading || isAvatarLoading}
                        className="w-full"
                      >
                        {isLoading ? "Updating..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Update your password for better security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your current password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your new password"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Updating..." : "Change Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
