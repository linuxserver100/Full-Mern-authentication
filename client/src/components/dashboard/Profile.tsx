import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema, ProfileUpdate } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";

export function ProfileComponent() {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(user?.profilePicture || null);

  const form = useForm<ProfileUpdate>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      profilePicture: user?.profilePicture || "",
    },
  });

  const onSubmit = async (data: ProfileUpdate) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      const result = await response.json();
      
      // Update user in context
      if (result.user) {
        setUser({
          ...user!,
          ...result.user,
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you'd upload this to a server and get a URL back
      // For this demo, we'll just use a local URL
      const imageUrl = URL.createObjectURL(file);
      setProfilePicturePreview(imageUrl);
      
      // In a real app, we'd set the form value to the URL returned from the server
      form.setValue("profilePicture", imageUrl);
      
      toast({
        title: "Profile picture updated",
        description: "Note: In this demo, profile pictures are not actually uploaded to a server.",
      });
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || "U";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile information and how it appears across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePicturePreview || undefined} alt={user?.username || "User"} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                JPG, GIF or PNG. Max size of 5MB.
              </p>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" type="button" className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Picture
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex w-full flex-col space-y-2">
          <h3 className="text-sm font-medium">Account Information</h3>
          <p className="text-sm text-muted-foreground">
            Email: <span className="font-medium">{user?.email}</span>
            {user?.isVerified ? (
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Verified
              </span>
            ) : (
              <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                Unverified
              </span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            Member since{" "}
            <span className="font-medium">
              {new Date().toLocaleDateString()}
            </span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
