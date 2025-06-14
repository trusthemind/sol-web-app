import { useState, useCallback } from "react";
import { toast } from "sonner";
import { userApi } from "../api/user.api";
import { useAuth } from "../stores/context/AuthContext";

interface UseAvatarUploadReturn {
  uploading: boolean;
  uploadProgress: number;
  uploadAvatar: (file: File) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
}

export function useAvatarUpload(
  onUploadSuccess?: (avatarUrl: string) => void,
  onDeleteSuccess?: () => void
): UseAvatarUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { updateAvatar: updateAvatarCtx } = useAuth();

  const handleUploadProgress = useCallback((progressEvent: any) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadProgress(progress);
  }, []);

  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        setUploadProgress(0);

        // Validate file
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select a valid image file");
        }

        // Check file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error("File size must be less than 5MB");
        }

        const response = await userApi.uploadAvatar(file, handleUploadProgress);

        if (response.data.avatar) {
          onUploadSuccess?.(response.data.avatar);
          updateAvatarCtx(response.data.avatar);
          toast.success("Avatar uploaded successfully!");
        }
      } catch (error: any) {
        console.error("Avatar upload failed:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to upload avatar";
        toast.error(errorMessage);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [handleUploadProgress, onUploadSuccess]
  );

  const updateAvatar = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        setUploadProgress(0);

        if (!file.type.startsWith("image/"))
          throw new Error("Please select a valid image file");

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize)
          throw new Error("File size must be less than 5MB");

        const response = await userApi.updateAvatar(file, handleUploadProgress);

        if (response.data.avatar) {
          onUploadSuccess?.(response.data.avatar);
          updateAvatarCtx(response.data.avatar);
          toast.success("Avatar updated successfully!");
        }
      } catch (error: any) {
        console.error("Avatar update failed:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update avatar";
        toast.error(errorMessage);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [handleUploadProgress, onUploadSuccess]
  );

  const deleteAvatar = useCallback(async () => {
    try {
      setUploading(true);

      await userApi.deleteAvatar();

      onDeleteSuccess?.();
      toast.success("Avatar removed successfully!");
    } catch (error: any) {
      console.error("Avatar deletion failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove avatar";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [onDeleteSuccess]);

  return {
    uploading,
    uploadProgress,
    uploadAvatar,
    updateAvatar,
    deleteAvatar,
  };
}
