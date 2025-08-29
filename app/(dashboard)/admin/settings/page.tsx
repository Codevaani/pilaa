"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Save, Bell, Shield, Database, Mail, Globe, Users, Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function AdminSettingsPage() {
  const { user, isLoaded } = useUser()
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Motel",
    siteDescription: "Premium Hotel Booking Platform",
    supportEmail: "support@motel.com",
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    
    // Platform Settings
    maintenanceMode: false,
    registrationEnabled: true,
    partnerRegistrationEnabled: true,
    
    // Payment Settings
    commissionRate: 15,
    paymentMethods: ["stripe", "razorpay"],
    
    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
  })

  const handleSave = () => {
    console.log("Saving settings:", settings)
    alert("Settings saved successfully!")
  }

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handleInputChange = (key: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure platform settings and preferences
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Site Information
                </CardTitle>
                <CardDescription>
                  Basic information about your platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Site Name</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Site Description</label>
                  <Input
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Support Email</label>
                  <Input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Platform Statistics
                </CardTitle>
                <CardDescription>
                  Current platform metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">15,420</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">2,850</div>
                    <div className="text-sm text-muted-foreground">Properties</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">45,680</div>
                    <div className="text-sm text-muted-foreground">Bookings</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">₹12.5M</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={() => handleToggle('smsNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggle('pushNotifications')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={() => handleToggle('twoFactorAuth')}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Password Policy</label>
                <select
                  value={settings.passwordPolicy}
                  onChange={(e) => handleInputChange('passwordPolicy', e.target.value)}
                  className="border rounded-md px-3 py-2 bg-background"
                >
                  <option value="weak">Weak</option>
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform */}
        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Platform Settings
              </CardTitle>
              <CardDescription>
                Configure platform behavior and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Put the platform in maintenance mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={() => handleToggle('maintenanceMode')}
                  />
                  {settings.maintenanceMode && (
                    <Badge variant="destructive">Active</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">User Registration</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow new user registrations
                  </p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={() => handleToggle('registrationEnabled')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Partner Registration</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow new partner applications
                  </p>
                </div>
                <Switch
                  checked={settings.partnerRegistrationEnabled}
                  onCheckedChange={() => handleToggle('partnerRegistrationEnabled')}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Commission Rate (%)</label>
                <Input
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Configuration
                </CardTitle>
                <CardDescription>
                  Configure SMTP settings for email delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">SMTP Host</label>
                  <Input
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">SMTP Port</label>
                  <Input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Username</label>
                  <Input
                    value={settings.smtpUsername}
                    onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Password</label>
                  <Input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage third-party service integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Stripe API Key</label>
                  <Input
                    type="password"
                    placeholder="sk_test_..."
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Razorpay API Key</label>
                  <Input
                    type="password"
                    placeholder="rzp_test_..."
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Google Maps API Key</label>
                  <Input
                    type="password"
                    placeholder="AIza..."
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Cloudinary API Key</label>
                  <Input
                    type="password"
                    placeholder="..."
                    className="font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
