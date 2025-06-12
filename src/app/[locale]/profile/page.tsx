"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Camera, Bell, Shield, Moon, Palette, Sparkles, Star, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function Profile() {
  const { t, locale, isLoading } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState("twiceDaily");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600 font-medium">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href={`/${locale}/dashboard`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full p-3 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {t("profile.title")}
              </h1>
              <p className="text-slate-600 text-lg mt-1">{t("profile.subtitle")}</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={
                isEditing
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/25 px-8"
                  : "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-8"
              }
            >
              {isEditing ? t("profile.saveChanges") : t("profile.editProfile")}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Profile Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
              <CardHeader className="text-center pb-6">
                <motion.div 
                  className="relative mx-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="w-28 h-28 mx-auto ring-4 ring-blue-100 shadow-lg">
                    <AvatarImage
                      src="/placeholder.svg?height=112&width=112"
                      alt="Profile"
                    />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <AnimatePresence>
                    {isEditing && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Button
                          size="icon"
                          className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <CardTitle className="mt-6 text-2xl text-slate-800">
                  Sarah Johnson
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  {t("profile.memberSince")}
                </CardDescription>
                <div className="flex justify-center space-x-3 mt-6">
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    {t("profile.premium")}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1 shadow-lg">
                    <Trophy className="h-3 w-3 mr-1" />
                    {t("profile.dayStreak")}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  {t("profile.yourProgress")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: t("profile.moodEntries"), value: "127", color: "from-blue-500 to-indigo-500" },
                  { label: t("profile.sessionsCompleted"), value: "23", color: "from-indigo-500 to-purple-500" },
                  { label: t("profile.currentStreak"), value: "12 days", color: "from-amber-500 to-orange-500" },
                  { label: t("profile.averageMood"), value: "7.6/10", color: "from-green-500 to-emerald-500" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100"
                  >
                    <span className="text-sm text-slate-600 font-medium">{stat.label}</span>
                    <span className={`font-bold text-lg bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800">
                  {t("profile.personalInfo")}
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  {t("profile.updateDetails")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">
                      {t("profile.firstName")}
                    </Label>
                    <Input
                      id="firstName"
                      defaultValue="Sarah"
                      disabled={!isEditing}
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">
                      {t("profile.lastName")}
                    </Label>
                    <Input
                      id="lastName"
                      defaultValue="Johnson"
                      disabled={!isEditing}
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm h-12"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    {t("profile.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="sarah.johnson@example.com"
                    disabled={!isEditing}
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    {t("profile.phone")}
                  </Label>
                  <Input
                    id="phone"
                    defaultValue="+1 (555) 123-4567"
                    disabled={!isEditing}
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-slate-700 font-medium">
                    {t("profile.bio")}
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder={t("profile.bioPlaceholder")}
                    defaultValue={t("profile.bioDefault")}
                    disabled={!isEditing}
                    rows={4}
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-200 bg-white/50 backdrop-blur-sm resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-blue-500" />
                  {t("profile.preferences")}
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  {t("profile.customizeExperience")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <motion.div 
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <Label htmlFor="notifications" className="text-base text-slate-800 font-medium">
                        {t("profile.pushNotifications")}
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("profile.notificationsDesc")}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500"
                  />
                </motion.div>

                <Separator className="bg-slate-200" />

                <motion.div 
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border border-slate-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <Moon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <Label htmlFor="darkMode" className="text-base text-slate-800 font-medium">
                        {t("profile.darkMode")}
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">
                        {t("profile.darkModeDesc")}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
                  />
                </motion.div>

                <Separator className="bg-slate-200" />

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Palette className="h-5 w-5 text-purple-600" />
                    </div>
                    <Label className="text-base text-slate-800 font-medium">
                      {t("profile.reminderFrequency")}
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-12">
                    {[
                      { id: "daily", label: t("profile.daily") },
                      { id: "twiceDaily", label: t("profile.twiceDaily") },
                      { id: "weekly", label: t("profile.weekly") }
                    ].map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => setReminderFrequency(option.id)}
                          className={
                            reminderFrequency === option.id
                              ? "w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                              : "w-full bg-white/80 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                          }
                        >
                          {option.label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <Shield className="h-6 w-6 mr-3 text-blue-500" />
                  {t("profile.privacySecurity")}
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  {t("profile.accountSecurity")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: t("profile.changePassword"), variant: "outline" as const },
                  { label: t("profile.twoFactor"), variant: "outline" as const },
                  { label: t("profile.downloadData"), variant: "outline" as const }
                ].map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={action.variant}
                      className="w-full justify-start h-12 bg-white/80 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                    >
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
                <Separator className="bg-slate-200 my-6" />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="destructive" 
                    className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                  >
                    {t("profile.deleteAccount")}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}