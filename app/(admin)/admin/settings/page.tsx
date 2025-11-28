"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, Bell, Shield, Globe, Database } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Nzimbo",
    siteDescription: "Find Your Perfect Spot",
    contactEmail: "admin@nzimbo.com",
    supportPhone: "+263 123 456 789",

    // Notification Settings
    emailNotifications: true,
    bookingAlerts: true,
    newUserAlerts: true,
    revenueReports: true,

    // Security Settings
    requireVerification: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,

    // System Settings
    maintenanceMode: false,
    cacheEnabled: true,
    backupFrequency: "daily",
  });

  const handleSave = async (section: string) => {
    // In a real app, you would send this to your API
    console.log(`Saving ${section} settings:`, settings);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`${section} settings saved successfully!`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage platform settings and configurations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        siteName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        siteDescription: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        supportPhone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={() => handleSave("general")}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">
                      Email Notifications
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </div>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="bookingAlerts">Booking Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified about new bookings
                    </div>
                  </div>
                  <Switch
                    id="bookingAlerts"
                    checked={settings.bookingAlerts}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        bookingAlerts: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newUserAlerts">New User Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications for new user registrations
                    </div>
                  </div>
                  <Switch
                    id="newUserAlerts"
                    checked={settings.newUserAlerts}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        newUserAlerts: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="revenueReports">Revenue Reports</Label>
                    <div className="text-sm text-muted-foreground">
                      Get daily/weekly revenue reports
                    </div>
                  </div>
                  <Switch
                    id="revenueReports"
                    checked={settings.revenueReports}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        revenueReports: checked,
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={() => handleSave("notifications")}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure platform security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireVerification">
                      Require Email Verification
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      Users must verify their email before booking
                    </div>
                  </div>
                  <Switch
                    id="requireVerification"
                    checked={settings.requireVerification}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        requireVerification: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">
                      Two-Factor Authentication
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </div>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        twoFactorAuth: checked,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        sessionTimeout: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        maxLoginAttempts: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={() => handleSave("security")}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                System configuration and maintenance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Take the site offline for maintenance
                    </div>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        maintenanceMode: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="cacheEnabled">Cache Enabled</Label>
                    <div className="text-sm text-muted-foreground">
                      Improve performance with caching
                    </div>
                  </div>
                  <Switch
                    id="cacheEnabled"
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        cacheEnabled: checked,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        backupFrequency: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* System Status */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">System Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        100%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Uptime
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        2.3s
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Response Time
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        1.2GB
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Database Size
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Badge variant="default">Healthy</Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        Status
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleSave("system")}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
