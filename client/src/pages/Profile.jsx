import { useState } from "react";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Profile = () => {
    // Mock user data
    const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        avatarUrl: "",
        role: "User"
    };

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        bio: "I am passionate about learning and sharing knowledge with others.",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    
    const [avatar, setAvatar] = useState(user.avatarUrl || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result);
                toast.success("Profile picture updated!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Profile updated successfully!");
        }, 1000);
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
            toast.success("Password updated successfully!");
        }, 1000);
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
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">No Avatar</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-full mt-6">
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleAvatarChange} 
                                    className="mb-2"
                                />
                                <Button variant="outline" className="w-full">
                                    Change Avatar
                                </Button>
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
                                            
                                            <Button type="submit" disabled={isLoading} className="w-full">
                                                {isLoading ? "Updating..." : "Update Profile"}
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
                                        Update your password and security preferences
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
                                                    placeholder="••••••••"
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
                                                    placeholder="••••••••"
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
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            
                                            <Button type="submit" disabled={isLoading} className="w-full">
                                                {isLoading ? "Updating..." : "Update Password"}
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

export default Profile;
