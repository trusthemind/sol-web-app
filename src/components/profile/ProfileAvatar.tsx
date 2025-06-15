"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Camera, Upload, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAvatarUpload } from "../../shared/hooks/useAvatarUpload";

interface ProfileAvatarProps {
  name: string;
  initials: string;
  avatarUrl?: string;
  memberSinceText: string;
  streakText: string;
  onAvatarChange?: (newAvatarUrl: string | null) => void;
}

export function ProfileAvatar({
  name,
  initials,
  avatarUrl,
  memberSinceText,
  streakText,
  onAvatarChange,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    setCurrentAvatarUrl(avatarUrl);
  }, [avatarUrl]);

  const {
    uploading,
    uploadProgress,
    uploadAvatar,
    updateAvatar,
    deleteAvatar,
  } = useAvatarUpload(
    (newAvatarUrl: string) => {
      setCurrentAvatarUrl(newAvatarUrl);
      onAvatarChange?.(newAvatarUrl);
    },
    () => {
      setCurrentAvatarUrl(undefined);
      onAvatarChange?.(null);
    }
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }

      if (currentAvatarUrl) {
        updateAvatar(file);
      } else {
        uploadAvatar(file);
      }
    }
    event.target.value = "";
    setIsDropdownOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await deleteAvatar();
    setShowDeleteDialog(false);
  };

  const renderAvatarButton = () => {
    if (uploading)
      return (
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Loader2 className="h-4 w-4 text-blue-700 animate-spin" />
        </div>
      );

    const quickUploadButton = (
      <Button
        size="icon"
        variant="secondary"
        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 shadow-md"
        onClick={handleUploadClick}
        disabled={uploading}
        title="Upload avatar"
      >
        <Camera className="h-4 w-4" />
      </Button>
    );

    if (currentAvatarUrl) {
      return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 shadow-md"
              disabled={uploading}
              title="Avatar options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleUploadClick}
              className="cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Avatar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDeleteClick}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Avatar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return quickUploadButton;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24 mx-auto ring-2 ring-gray-100">
                <AvatarImage
                  src={
                    currentAvatarUrl || "/placeholder.svg?height=96&width=96"
                  }
                  alt={`${name}'s avatar`}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700 font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {renderAvatarButton()}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {uploading && (
              <motion.div
                className="mt-4 space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </motion.div>
            )}

            <CardTitle className="mt-4 text-gray-800 text-xl">{name}</CardTitle>
            <CardDescription className="text-gray-600">
              {memberSinceText}
            </CardDescription>

            <div className="flex justify-center space-x-2 mt-4">
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                {streakText}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

     
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Avatar</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your profile avatar? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
