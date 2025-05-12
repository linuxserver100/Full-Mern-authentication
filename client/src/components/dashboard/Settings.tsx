import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

export function SettingsComponent() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState({
    accountUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  const handleEmailPreferenceChange = (key: keyof typeof emailNotifications) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: !emailNotifications[key],
    });
    
    toast({
      title: "Preferences updated",
      description: "Your email notification preferences have been saved.",
    });
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    
    toast({
      title: "Theme updated",
      description: `Theme changed to ${value}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the appearance of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger id="theme" className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select a theme preference for the application interface.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage your email notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="account-updates">Account Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about your account activity and security.
              </p>
            </div>
            <Switch
              id="account-updates"
              checked={emailNotifications.accountUpdates}
              onCheckedChange={() => handleEmailPreferenceChange("accountUpdates")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="security-alerts">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about security alerts and suspicious activities.
              </p>
            </div>
            <Switch
              id="security-alerts"
              checked={emailNotifications.securityAlerts}
              onCheckedChange={() => handleEmailPreferenceChange("securityAlerts")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive newsletters, product updates, and offers.
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={emailNotifications.marketingEmails}
              onCheckedChange={() => handleEmailPreferenceChange("marketingEmails")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language and Region</CardTitle>
          <CardDescription>
            Manage your language and regional preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language" className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="utc">
              <SelectTrigger id="timezone" className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={() => {
              toast({
                title: "Preferences saved",
                description: "Your language and regional preferences have been updated.",
              });
            }}
          >
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
