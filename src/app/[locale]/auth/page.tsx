"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, Users, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import clsx from "clsx";
import RegisterForm from "@/src/shared/widgets/RegistrationForm";
import LoginForm from "@/src/shared/widgets/LoginForm";
import { AuthHeader } from "@/src/components/AuthHeader";

type Tabs = "signin" | "signup";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1],
    },
  },
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<Tabs>("signin");
  const { t } = useTranslation();

  const addictionalInfo = [
    {
      icon: Heart,
      color: "from-red-500 to-pink-500",
      shadowColor: "shadow-red-500/25",
      title: t("auth.features.moodTracking.title"),
      description: t("auth.features.moodTracking.description"),
      delay: 0,
    },
    {
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      shadowColor: "shadow-blue-500/25",
      title: t("auth.features.professionalSupport.title"),
      description: t("auth.features.professionalSupport.description"),
      delay: 0.2,
    },
    {
      icon: Shield,
      color: "from-indigo-500 to-blue-600",
      shadowColor: "shadow-indigo-500/25",
      title: t("auth.features.securePrivate.title"),
      description: t("auth.features.securePrivate.description"),
      delay: 0.4,
    },
  ];
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isClient]);

  return (
    <div
      className={clsx(
        "min-h-screen relative overflow-hidden",
        "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
      )}
    >
      <div className="absolute inset-0">
        {isClient && (
          <motion.div
            className={clsx(
              "absolute w-64 h-64 rounded-full blur-2xl pointer-events-none",
              "bg-gradient-to-r from-blue-500/20 to-indigo-600/20"
            )}
            animate={{
              x: mousePosition.x - 128,
              y: mousePosition.y - 128,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200,
            }}
          />
        )}
      </div>

      <div className="relative z-10 min-h-screen backdrop-blur-sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 py-8"
        >
          <AuthHeader itemVariants={itemVariants} />

          <div className="flex justify-center mb-16">
            <motion.div variants={itemVariants} className="w-full max-w-2xl">
              <Card
                className={clsx(
                  "w-full shadow-2xl",
                  "bg-white/10 backdrop-blur-md border-white/20"
                )}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl text-white font-bold">
                    {activeTab === "signin"
                      ? t("auth.welcomeBack")
                      : t("auth.joinToday")}
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-lg mt-2">
                    {activeTab === "signin"
                      ? t("auth.signInDescription")
                      : t("auth.signUpDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 px-8">
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as Tabs)}
                    className="w-full"
                  >
                    <TabsList
                      className={clsx(
                        "grid w-full grid-cols-2",
                        "bg-white/10 backdrop-blur-sm border-white/20"
                      )}
                    >
                      <TabsTrigger
                        value="signin"
                        className={clsx(
                          "text-white-300 transition-all duration-300",
                          "data-[state=active]:bg-gradient-to-r",
                          "data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500",
                          "data-[state=active]:text-white"
                        )}
                      >
                        {t("auth.signIn")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="signup"
                        className={clsx(
                          "text-white-300 transition-all duration-300",
                          "data-[state=active]:bg-gradient-to-r",
                          "data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600",
                          "data-[state=active]:text-white"
                        )}
                      >
                        {t("auth.signUp")}
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-8">
                      <AnimatePresence mode="wait">
                        <TabsContent
                          value="signin"
                          key="signin"
                          className="m-0"
                        >
                          <LoginForm />
                        </TabsContent>

                        <TabsContent
                          value="signup"
                          key="signup"
                          className="m-0"
                        >
                          <RegisterForm />
                        </TabsContent>
                      </AnimatePresence>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {addictionalInfo.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="group"
                >
                  <Card
                    className={clsx(
                      "p-8 h-full transition-all duration-500",
                      "bg-white/10 backdrop-blur-md border-white/20",
                      "hover:bg-white/15 hover:shadow-xl",
                      feature.shadowColor
                    )}
                  >
                    <div className="text-center space-y-6">
                      <motion.div
                        className={clsx(
                          "inline-flex p-4 rounded-2xl shadow-lg mx-auto",
                          `bg-gradient-to-br ${feature.color}`
                        )}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <div>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <h3
                            className={clsx(
                              "font-bold text-xl text-white transition-colors",
                              "group-hover:text-blue-300"
                            )}
                          >
                            {feature.title}
                          </h3>
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <p className="text-slate-300 leading-relaxed text-base">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
