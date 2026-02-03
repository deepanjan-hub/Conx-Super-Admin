import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Lock,
  Palette,
  Users,
  Shield,
  Key,
  Save,
  Trash2,
} from "lucide-react";

const teamMembers = [
  { id: "1", name: "Super Admin", email: "admin@qubelabs.ai", role: "Admin", status: "active" },
  { id: "2", name: "Operations Manager", email: "ops@qubelabs.ai", role: "Ops Manager", status: "active" },
  { id: "3", name: "Security Lead", email: "security@qubelabs.ai", role: "Support", status: "active" },
];

const Settings = () => {
  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      SA
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Super Admin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="admin@qubelabs.ai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Super Admin" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="UTC+5:30 (IST)" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage admin team access and roles</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Users className="h-4 w-4" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {member.role}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Change Password</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-sm text-muted-foreground">
                        Current Password
                      </Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-sm text-muted-foreground">
                        New Password
                      </Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm text-muted-foreground">
                        Confirm Password
                      </Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Key className="h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base">New Client Onboarding</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a new client signs up</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for suspicious activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base">Billing Updates</Label>
                    <p className="text-sm text-muted-foreground">Payment confirmations and invoices</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base">System Health Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about system degradation</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;