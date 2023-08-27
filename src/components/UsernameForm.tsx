"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Community, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UsernameValidator } from "@/lib/validators/username";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { UserAvatar } from "./UserAvatar";
import { Avatar, AvatarImage } from "./ui/Avatar";
import { uploadFiles } from "@/lib/uplodthing";
import {
  RemoveUseravatarRequest,
  UseravatarRequest,
} from "@/lib/validators/useravatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "username" | "image" | "name">;
}

type FormData = z.infer<typeof UsernameValidator>;

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
  const [content, setContent] = React.useState("helloooo");
  const handleContentChange = (e: any) => {
    setContent(e.target.innerText);
  };
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || user.id,
    },
  });
  const [avatarFile, setAvatarFile] = React.useState<unknown[]>();
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-expect-error
    let file = Array.from(e.target.files);
    console.log(file);
    setAvatarFile(file);

    // const [res] = await uploadFiles(file, "imageUploader");
    // setAvatarUrl(res.fileUrl);
    // updateUseravatar({ fileUrl: res.fileUrl });
  };

  const { data: OwnedCommunities } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/community/fetch`);
      console.log(data);

      return data as Community[];
    },
  });

  const { mutate: updateUseravatar, isLoading: isAvatarLoading } = useMutation({
    mutationFn: async () => {
      const [res] = await uploadFiles(avatarFile as File[], "imageUploader");

      const payload: UseravatarRequest = {
        fileUrl: res.fileUrl,
        fileKey: res.fileKey,
      };

      const { data } = await axios.patch(`/api/user/useravatar/`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }

      return toast({
        title: "Something went wrong.",
        description: "Your useravatar was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your useravatar has been updated.",
      });
      router.refresh();
    },
  });

  const { mutate: removeUseravatar, isLoading: isRemoveAvatarLoading } =
    useMutation({
      mutationFn: async ({ userId }: RemoveUseravatarRequest) => {
        const payload: RemoveUseravatarRequest = { userId };

        const { data } = await axios.patch(`/api/user/removeavatar/`, payload);
        return data;
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          return toast({
            title: "Something went wrong",
            variant: "destructive",
          });
        }

        return toast({
          title: "Something went wrong.",
          description: "Your useravatar was not updated. Please try again.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          description: "Your useravatar has been removed.",
        });
        router.refresh();
      },
    });

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: FormData) => {
      const payload: FormData = { name };

      const { data } = await axios.patch(`/api/user/username/`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already taken.",
            description: "Please choose another username.",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your username was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your username has been updated.",
      });
      router.refresh();
    },
  });
  console.log("imaggee", user.image);

  return (
    <>
      <form
        className={cn(className)}
        onSubmit={handleSubmit((e) => updateUsername(e))}
        {...props}
      >
        <Card className="bg-deep-champagne border-black">
          <CardHeader>
            <CardTitle>Your username</CardTitle>
            <CardDescription>
              Please enter a display name you are comfortable with.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative grid gap-1">
              <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                <span className="text-sm text-zinc-400">u/</span>
              </div>
              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                className="w-[400px] pl-6 border-black"
                size={32}
                {...register("name")}
              />
              {errors?.name && (
                <p className="px-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button isLoading={isLoading}>Change name</Button>
          </CardFooter>
        </Card>
      </form>
      <Card className="bg-deep-champagne border-black">
        <CardHeader>
          <CardTitle>Your display image</CardTitle>
          <CardDescription>Please choose a display image.</CardDescription>
        </CardHeader>

        {/* <UserAvatar
                className="h-8 w-8"
                // user={{
                //   name: user.name || null,
                //   image: user.image || null,
                // }}
                user={{
                  image: user.image,
                }}
              /> */}
        <UserAvatar
          className="h-8 w-8 ml-6"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
        {/* <input type="file" /> */}

        <Input
          className="w-[400px] pl-6 ml-6 mt-6 mb-6 border-black"
          type="file"
          onChange={(e) => {
            handleUpload(e);
          }}
        />
        <Button
          isLoading={isAvatarLoading}
          onClick={() => updateUseravatar()}
          className="ml-6 mr-4 mb-6"
        >
          Update Avatar
        </Button>
        <Button
          isLoading={isRemoveAvatarLoading}
          onClick={() => removeUseravatar({ userId: user.id })}
        >
          Remove Avatar
        </Button>
      </Card>
      <Card className="bg-deep-champagne border-black">
        <CardHeader>
          <CardTitle>Communities you own</CardTitle>
          <CardDescription>
            You can edit or delete your community here.
          </CardDescription>
        </CardHeader>

        {/* <UserAvatar
                className="h-8 w-8"
                // user={{
                //   name: user.name || null,
                //   image: user.image || null,
                // }}
                user={{
                  image: user.image,
                }}
              /> */}

        {/* <input type="file" /> */}
        {OwnedCommunities?.map((community) => (
          <p
            contentEditable={true}
            onInput={handleContentChange}
            onBlur={() => console.log("blur")}
            className="w-40 focus:outline-none"
            key={community.id}
          >
            {community.name}
          </p>
        ))}
      </Card>
    </>
  );
}
