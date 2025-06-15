"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/src/components/profile/ProfileAvatar";
import { ProgressStats } from "@/src/components/profile/ProgressStats";
import { PersonalInfoForm } from "@/src/shared/widgets/PersonalForm";
import { SecurityCard } from "@/src/components/profile/SecurityCard";
import { useAuth } from "@/src/shared/stores/context/AuthContext";
import { useProfile } from "@/src/shared/hooks/useProfile";
import dayjs from "@/src/shared/config/dayjs";

export default function Profile() {
  const { t, locale, isLoading } = useTranslation();
  const { user, updateUser, logout } = useAuth();
  const { user: userProfile } = useProfile();
  console.log(userProfile);

  useEffect(() => {
    updateUser({ ...userProfile });
  }, []);

  if (isLoading) {
    return <LoadingSpinner loadingText={t("common.loading")} />;
  }

  const progressStats = [
    { label: t("profile.moodEntries"), value: "127" },
    { label: t("profile.sessionsCompleted"), value: "23" },
    { label: t("profile.currentStreak"), value: "12 days" },
    { label: t("profile.averageMood"), value: "7.6/10" },
  ];

  const securityButtons = {
    changePassword: t("profile.changePassword"),
    twoFactor: t("profile.twoFactor"),
    deleteAccount: t("profile.deleteAccount"),
    logout: t("profile.logout"),
  };

  return (
    <div className="h-screen bg-white ">
      <div className="container mx-auto px-4 mt-20 max-w-4xl">
        <ProfileHeader
          locale={locale}
          title={t("profile.title")}
          subtitle={t("profile.subtitle")}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileAvatar
              name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
              initials={user?.firstName ? user.firstName[0].toUpperCase() : ""}
              avatarUrl={user?.avatar}
              memberSinceText={dayjs(userProfile?.sinceForm).format(
                "MMMM D, YYYY"
              )}
              streakText={t("profile.dayStreak")}
            />
            <ProgressStats
              title={t("profile.yourProgress")}
              stats={progressStats}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoForm user={userProfile} />

            {user && (
              <SecurityCard
                user={user}
                title={t("profile.privacySecurity")}
                description={t("profile.accountSecurity")}
                buttons={securityButtons}
                logout={logout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
