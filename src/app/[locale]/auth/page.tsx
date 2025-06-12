"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Heart,
  Shield,
  Users,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import clsx from "clsx";
import RegisterForm from "../../widgets/RegistrationForm";
import LoginForm from "../../widgets/LoginForm";


export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

  // Fix hydration by ensuring client-side only rendering for random elements
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate consistent particle positions only on client
  const particlePositions = useMemo(() => {
    if (!isClient) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
  }, [isClient]);

  // Mouse tracking for interactive background
  useEffect(() => {
    if (!isClient) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isClient]);

  // Form submit handlers
  const handleLogin = async (data: { email: string; password: string }) => {
    // Handle login logic here
    console.log("Login data:", data);
    // You can add your authentication API call here
  };

  const handleRegister = async (data: { email: string; password: string }) => {
    // Handle registration logic here
    console.log("Register data:", data);
    // You can add your registration API call here
  };

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

  const floatingIconVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={clsx(
      "min-h-screen relative overflow-hidden",
      "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    )}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className={clsx(
            "absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl",
            "bg-gradient-to-r from-blue-500/30 to-indigo-500/30"
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={clsx(
            "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl",
            "bg-gradient-to-r from-indigo-500/30 to-blue-600/30"
          )}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Interactive Mouse Follower - Client Side Only */}
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

        {/* Floating Particles - Client Side Only */}
        {isClient && particlePositions.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen backdrop-blur-sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 py-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              className="flex items-center justify-center mb-6"
              variants={floatingIconVariants}
              animate="animate"
            >
              <div className="relative">
                <Brain className={clsx(
                  "h-16 w-16 text-blue-400 mr-3"
                )} />
                <motion.div
                  className={clsx(
                    "absolute -top-1 -right-1 w-4 h-4 rounded-full",
                    "bg-gradient-to-r from-blue-500 to-indigo-500"
                  )}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
              <h1 className={clsx(
                "text-6xl font-bold bg-clip-text text-transparent",
                "bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500"
              )}>
                Sol
              </h1>
              <Sparkles className="h-8 w-8 text-blue-400 ml-3" />
            </motion.div>
            <motion.p
              className={clsx(
                "text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
              )}
              variants={itemVariants}
            >
              {t("auth.subtitle")}
            </motion.p>
          </motion.div>

          {/* Auth Form - Centered */}
          <div className="flex justify-center mb-16">
            <motion.div variants={itemVariants} className="w-full max-w-2xl">
              <Card className={clsx(
                "w-full shadow-2xl",
                "bg-white/10 backdrop-blur-md border-white/20"
              )}>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl text-white font-bold">
                    {activeTab === "signin" ? t("auth.welcomeBack") : t("auth.joinToday")}
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-lg mt-2">
                    {activeTab === "signin" 
                      ? t("auth.signInDescription") 
                      : t("auth.signUpDescription")
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 px-8">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className={clsx(
                      "grid w-full grid-cols-2",
                      "bg-white/10 backdrop-blur-sm border-white/20"
                    )}>
                      <TabsTrigger
                        value="signin"
                        className={clsx(
                          "text-slate-300 transition-all duration-300",
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
                          "text-slate-300 transition-all duration-300",
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
                        <TabsContent value="signin" key="signin" className="m-0">
                          <LoginForm onSubmit={handleLogin} />
                        </TabsContent>

                        <TabsContent value="signup" key="signup" className="m-0">
                          <RegisterForm onSubmit={handleRegister} />
                        </TabsContent>
                      </AnimatePresence>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t("auth.features.title")}
              </h2>
              <p className="text-slate-300 text-lg">
                {t("auth.features.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
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
              ].map((feature, index) => (
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
                          <h3 className={clsx(
                            "font-bold text-xl text-white transition-colors",
                            "group-hover:text-blue-300"
                          )}>
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

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center pt-16"
            >
              <div className={clsx(
                "flex flex-wrap justify-center items-center gap-8 text-slate-400"
              )}>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium">{t("auth.trust.ssl")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium">{t("auth.trust.gdpr")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  <span className="text-sm font-medium">{t("auth.trust.users")}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}