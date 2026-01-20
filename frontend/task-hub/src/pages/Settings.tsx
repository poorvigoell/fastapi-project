import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock, Phone, Loader2, CheckCircle2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(6, "New password must be at least 6 characters"),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

const phoneSchema = z.object({
  phone_number: z.string().min(1, "Phone number is required"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;

const Settings = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone_number: user?.phone_number || "",
    },
  });

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      await api.put("/user/password", {
        current_password: data.current_password,
        new_password: data.new_password,
      });

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

      passwordForm.reset();
    } catch (err) {
      toast({
        title: "Password update failed",
        description: "Current password is incorrect.",
        variant: "destructive",
      });
    }
  };

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    try {
      await api.put(`/user/phonenumber/${data.phone_number}`);

      setPhoneNumber(data.phone_number);
      await refreshUser();
      phoneForm.reset({ phone_number: data.phone_number });

      toast({
        title: "Phone number updated",
        description: "Your phone number has been changed successfully.",
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: "Could not update phone number.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <main className="content-container max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="space-y-6">
          {/* Update Phone Number */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Phone Number</CardTitle>
              </div>
              <CardDescription>
                Update your phone number for account recovery and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="phone_number">Current phone number</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {phoneNumber}
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="new_phone">New phone number</Label>
                  <Input
                    id="new_phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...phoneForm.register("phone_number")}
                  />
                  {phoneForm.formState.errors.phone_number && (
                    <p className="text-sm text-destructive">
                      {phoneForm.formState.errors.phone_number.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={phoneForm.formState.isSubmitting ||
    phoneForm.watch("phone_number") === phoneNumber}>
                  {phoneForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Phone Number"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* Update Password */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="current_password">Current password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    placeholder="Enter current password"
                    {...passwordForm.register("current_password")}
                  />
                  {passwordForm.formState.errors.current_password && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.current_password.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="new_password">New password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    placeholder="Enter new password"
                    {...passwordForm.register("new_password")}
                  />
                  {passwordForm.formState.errors.new_password && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.new_password.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="confirm_password">Confirm new password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm new password"
                    {...passwordForm.register("confirm_password")}
                  />
                  {passwordForm.formState.errors.confirm_password && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
