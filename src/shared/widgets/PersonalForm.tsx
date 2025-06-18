import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { useProfile, useProfileUpdate } from "@/src/shared/hooks/useProfile";
import {
  UpdateProfileFormData,
  updateProfileSchema,
} from "@/src/utils/validation/profile.schema";
import { SubmitHandler } from "react-hook-form";
import { UserData } from "../types/Api.type";
import { toast } from "sonner";

interface PersonalInfoFormProps {
  user?: UserData | null;
}

export const PersonalInfoForm = ({ user: propUser }: PersonalInfoFormProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const { user: hookUser, refetch } = useProfile();
  const user = propUser || hookUser;

  const { updating, updateProfile } = useProfileUpdate(() => {
    setIsEditing(false);
    refetch();
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<UpdateProfileFormData> = async (data) => {
    try {
      const success = await updateProfile(data);
      if (success) {
        toast.success(t("profile.updateSuccess"));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(t("profile.updateError"));
    }
  };

  const handleCancel = () => {
    reset(); // Reset form to original values
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-slate-800">
              {t("profile.personalInfo")}
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              {t("profile.updateDetails")}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={handleEdit}
              className="border-slate-200 hover:border-blue-400 hover:bg-blue-50"
            >
              {t("common.edit")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-slate-700 font-medium">
                {t("profile.firstName")} *
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                disabled={!isEditing}
                className={`border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm h-12 ${
                  errors.firstName ? "border-red-400 focus:border-red-400" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-3">
              <Label htmlFor="lastName" className="text-slate-700 font-medium">
                {t("profile.lastName")} *
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                disabled={!isEditing}
                className={`border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm h-12 ${
                  errors.lastName ? "border-red-400 focus:border-red-400" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              {t("profile.email")} *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={!isEditing}
              className={`border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm h-12 ${
                errors.email ? "border-red-400 focus:border-red-400" : ""
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-slate-700 font-medium">
              {t("profile.phone")}
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+1 (555) 123-4567"
              disabled={!isEditing}
              className={`border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm h-12 ${
                errors.phone ? "border-red-400 focus:border-red-400" : ""
              }`}
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updating}
                className="border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={updating || !isDirty}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("common.saving")}
                  </>
                ) : (
                  t("common.saveChanges")
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
