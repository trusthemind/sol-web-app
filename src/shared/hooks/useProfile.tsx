import { useState, useEffect } from "react";
import { userApi } from "@/src/shared/api/user.api";
import { UpdateProfileRequest, UserData } from "../types/Api.type";
import { toast } from "sonner";

export const useProfile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getProfile();
      setUser(response.data.user);
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to load profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchProfile,
  };
};

export const useProfileUpdate = (
  onSuccess?: (updatedUser?: UserData) => void
) => {
  const [updating, setUpdating] = useState(false);

  const updateProfile = async (
    data: UpdateProfileRequest
  ): Promise<boolean> => {
    try {
      setUpdating(true);

      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const response = await userApi.updateProfile(cleanData);

      if (response.data?.user) {
        onSuccess?.(response.data.user);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error("Profile update error:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    updateProfile,
  };
};
