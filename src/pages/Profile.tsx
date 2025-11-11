import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  Edit2,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { ProfileHeader } from "@/components/ProfileHeader";

export default function Profile() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bio: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    incidentAlerts: true,
    safetyUpdates: true,
    weeklyReport: true,
  });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        setFormData((prev) => ({
          ...prev,
          email: session.user.email || "",
          username: session.user.user_metadata?.username || "User",
          phone: session.user.user_metadata?.phone || "",
          address: session.user.user_metadata?.address || "",
          city: session.user.user_metadata?.city || "",
          state: session.user.user_metadata?.state || "",
          zipCode: session.user.user_metadata?.zipCode || "",
          bio: session.user.user_metadata?.bio || "",
          emergencyContact: session.user.user_metadata?.emergencyContact || "",
          emergencyPhone: session.user.user_metadata?.emergencyPhone || "",
        }));
      }
      setIsLoading(false);
    };

    getSession();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: formData.username,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          bio: formData.bio,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
        },
      });

      if (error) throw error;
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  const getInitials = () => {
    return formData.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <ProfileHeader />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-6">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="gap-2 text-base hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Profile
          </h1>
          <div className="w-20" />
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8 border-2 shadow-xl bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-primary shadow-lg">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{formData.username}</h2>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="gap-2 px-3 py-1.5">
                      <Shield className="w-4 h-4 text-success" />
                      Verified User
                    </Badge>
                    <Badge variant="outline" className="gap-2 px-3 py-1.5">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Member since {new Date(session?.user?.created_at || Date.now()).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-background border-2 shadow-lg">
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <MapPin className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Bell className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b-2">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2 text-base font-semibold">
                      <User className="w-4 h-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="h-12 border-2"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-base font-semibold">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="h-12 border-2 bg-muted"
                      placeholder="Your email"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-2 text-base font-semibold">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full h-24 px-4 py-2 border-2 rounded-md bg-background disabled:bg-muted text-base focus:border-primary focus:outline-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b-2">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Update your address and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Primary Contact */}
                <div className="space-y-4 pb-4 border-b-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Primary Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="h-12 border-2"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4 pb-4 border-b-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Address
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base font-semibold">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="h-12 border-2"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-base font-semibold">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="h-12 border-2"
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-base font-semibold">
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="h-12 border-2"
                        placeholder="NY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-base font-semibold">
                        ZIP Code
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="h-12 border-2"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4 p-4 bg-warning/5 border-2 border-warning/30 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact" className="text-base font-semibold">
                        Name
                      </Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="h-12 border-2"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="text-base font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        id="emergencyPhone"
                        name="emergencyPhone"
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="h-12 border-2"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b-2">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Account Security Status */}
                <div className="p-4 bg-success/5 border-2 border-success/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Account Status
                    </h3>
                    <Badge className="bg-success text-white">Secure</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your account is protected with Supabase authentication
                  </p>
                </div>

                <Separator />

                {/* Change Password Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Change Password
                  </h3>

                  {!isChangingPassword ? (
                    <Button
                      onClick={() => setIsChangingPassword(true)}
                      variant="outline"
                      className="border-2 h-12"
                    >
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-4 p-4 bg-background border-2 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-base font-semibold">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="h-12 border-2"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-base font-semibold">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="h-12 border-2"
                          placeholder="Enter new password (min. 6 characters)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-base font-semibold">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="h-12 border-2"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button
                          onClick={handleChangePassword}
                          disabled={isLoading}
                          className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsChangingPassword(false);
                            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                          }}
                          variant="outline"
                          className="flex-1 h-12 border-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Session Information */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-lg">Session Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Status:</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span className="font-medium">
                        {new Date(session?.user?.last_sign_in_at || Date.now()).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-medium">
                        {new Date(session?.user?.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b-2">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Email Notifications */}
                <div className="space-y-4 p-4 border-2 rounded-lg hover:bg-muted/30 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          emailNotifications: e.target.checked,
                        }))
                      }
                      className="w-6 h-6 cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                {/* Incident Alerts */}
                <div className="space-y-4 p-4 border-2 rounded-lg hover:bg-muted/30 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Incident Alerts</h3>
                      <p className="text-sm text-muted-foreground">Get notified about bus safety incidents</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.incidentAlerts}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          incidentAlerts: e.target.checked,
                        }))
                      }
                      className="w-6 h-6 cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                {/* Safety Updates */}
                <div className="space-y-4 p-4 border-2 rounded-lg hover:bg-muted/30 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Safety Updates</h3>
                      <p className="text-sm text-muted-foreground">Receive important safety tips and updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.safetyUpdates}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          safetyUpdates: e.target.checked,
                        }))
                      }
                      className="w-6 h-6 cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                {/* Weekly Report */}
                <div className="space-y-4 p-4 border-2 rounded-lg hover:bg-muted/30 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Weekly Report</h3>
                      <p className="text-sm text-muted-foreground">Get a weekly summary of bus incidents</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReport}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          weeklyReport: e.target.checked,
                        }))
                      }
                      className="w-6 h-6 cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={() => toast.success("Notification preferences saved!")}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="mt-8 border-2 border-destructive/50 shadow-lg">
          <CardHeader className="bg-destructive/5 border-b-2 border-destructive/30">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full h-12 font-semibold text-base gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground mt-8 pb-8">
          <p>Need help? <a href="#" className="text-primary hover:underline">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
}
