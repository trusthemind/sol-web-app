import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Camera, X } from "lucide-react";
import { UserData } from "../types/Api.type";
import { useAvatarUpload } from "../hooks/useAvatarUpload";

interface ProfileAvatarContainerProps {
  user: UserData;
  isEditing: boolean;
  onAvatarUpdate: (avatarUrl: string | null) => void;
}

export const ProfileAvatarContainer = ({
  user,
  isEditing,
  onAvatarUpdate,
}: ProfileAvatarContainerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { uploading, uploadProgress, updateAvatar, deleteAvatar } = useAvatarUpload(
    (avatarUrl) => {
      onAvatarUpdate(avatarUrl);
      setPreviewUrl(null);
    },
    () => {
      onAvatarUpdate(null);
      setPreviewUrl(null);
    }
  );

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    await updateAvatar(file);
  };

  const handleRemoveImage = async () => {
    await deleteAvatar();
  };

  const getInitials = () => {
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  const avatarSrc = previewUrl || user.avatar;

  return (
    <motion.div
      className="relative mx-auto"
      whileHover={{ scale: isEditing ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative">
        <Avatar
          className={`w-28 h-28 mx-auto ring-4 ring-blue-100 shadow-lg transition-opacity ${
            isEditing ? "cursor-pointer" : "cursor-default"
          } ${uploading ? "opacity-50" : ""}`}
          onClick={handleImageClick}
        >
          <AvatarImage src={avatarSrc} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-white text-sm font-medium">{uploadProgress}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -bottom-2 -right-2 flex gap-1"
          >
            <Button
              size="icon"
              onClick={handleImageClick}
              disabled={uploading}
              className="rounded-full w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
            >
              <Camera className="h-4 w-4" />
            </Button>

            {avatarSrc && (
              <Button
                size="icon"
                onClick={handleRemoveImage}
                disabled={uploading}
                className="rounded-full w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploading && uploadProgress > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32"
          >
            <div className="bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};