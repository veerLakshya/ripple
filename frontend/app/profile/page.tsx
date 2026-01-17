"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPatch, createBrowserApiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const optionalText = z
  .string()
  .transform((value) => value.trim())
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const ProfileSchema = z.object({
  displayName: optionalText,
  handle: optionalText,
  bio: optionalText,
  avatarUrl: optionalText,
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

type UserResponse = {
  id: number;
  clearUserId: string;
  email: string | null;
  displayName: string | null;
  handle: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

const ProfilePage = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const apiClient = useMemo(() => createBrowserApiClient(getToken), [getToken]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      handle: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);

        const getUserInfo = await apiGet<UserResponse>(apiClient, "/api/me/");
        console.log("getUserInfo", getUserInfo);

        if (!isMounted) return;

        console.log(getUserInfo);

        form.reset({
          displayName: getUserInfo.displayName ?? "",
          handle: getUserInfo.handle ?? "",
          bio: getUserInfo.bio ?? "",
          avatarUrl: getUserInfo.avatarUrl ?? "",
        });
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [apiClient, form]);

  const displayNameValue = form.watch("displayName");
  const handleValue = form.watch("handle");
  const avatarUrlValue = form.watch("avatarUrl");

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsSaving(true);

      const payload: Record<string, string> = {};

      if (values.displayName) payload.displayName = values.displayName;
      if (values.handle) payload.handle = values.handle?.toLocaleLowerCase();
      if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
      if (values.bio) payload.bio = values.bio;

      const apiResponse = await apiPatch<typeof payload, UserResponse>(
        apiClient,
        "/api/me",
        payload,
      );

      form.reset({
        displayName: apiResponse.displayName ?? "",
        handle: apiResponse.handle ?? "",
        bio: apiResponse.bio ?? "",
        avatarUrl: apiResponse.avatarUrl ?? "",
      });

      toast.success("Profile Updated Successfully", {
        description: "Your changes have been saved successfully",
      });
    } catch (err) {
      console.log("Error updating profile: ", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <SignedOut>User is Signed Out</SignedOut>
      <SignedIn>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
          <div className="">
            <h1 className="flex items-center text-3xl font-bold tracking-tight text-foreground">
              <User className="text-primary size-8" />
              Profile settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your profile information
            </p>
          </div>
          <Card className="border-border/70 bg-card">
            <CardHeader>
              <div className="flex items-start gap-6">
                <Avatar className="size-20">
                  {avatarUrlValue && (
                    <AvatarImage
                      src={avatarUrlValue || "/placeholder.xyz"}
                      alt={displayNameValue ?? ""}
                    />
                  )}
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl text-foreground">
                    {displayNameValue || "Your Display Name"}
                  </CardTitle>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        handleValue
                          ? "bg-primary/10 text-primary"
                          : "bg-accent text-accent-foreground",
                      )}
                    >
                      {handleValue ? `@${handleValue}` : "@handle"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-border/70 bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO- add error states here */}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* display name */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Display Name
                    </label>
                    <Input
                      id="displayName"
                      placeholder="Lakshya veer singh"
                      {...form.register("displayName")}
                      disabled={isLoading || isSaving}
                      className="border-border bg-background/60 text-sm"
                    />
                  </div>
                  {/* handle */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Handle
                    </label>
                    <Input
                      id="handle"
                      placeholder="@lvs"
                      {...form.register("handle")}
                      disabled={isLoading || isSaving}
                      className="border-border bg-background/60 text-sm"
                    />
                  </div>
                  {/* Bio */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="tell about yourself"
                      rows={4}
                      {...form.register("bio")}
                      disabled={isLoading || isSaving}
                      className="border-border bg-background/60 text-sm"
                    />
                  </div>
                  {/* avatar url */}
                  <div className="flex flex-col space-y-2 col-span-2">
                    <label className="text-sm font-semibold text-foreground">
                      Avatar Image Url
                    </label>
                    <Input
                      id="avatar"
                      placeholder="exampleurl.com"
                      {...form.register("avatarUrl")}
                      disabled={isLoading || isSaving}
                      className="border-border bg-background/60 text-sm"
                    />
                  </div>
                </div>
                <CardFooter className="p-0">
                  <Button
                    type="submit"
                    disabled={isSaving || isLoading}
                    className="bg-primary text-primary-foreground"
                    variant="default"
                  >
                    <Save className="size-4" />{" "}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </SignedIn>
    </>
  );
};

export default ProfilePage;
