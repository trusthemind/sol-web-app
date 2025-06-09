"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Heart, Shield, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/useTranslation"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { t, locale } = useTranslation()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate auth process
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/${locale}/dashboard`)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("auth.title")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("auth.subtitle")}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>{t("auth.welcomeBack")}</CardTitle>
                <CardDescription>{t("auth.signInDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
                    <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleAuth} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("auth.email")}</Label>
                        <Input id="email" type="email" placeholder={t("auth.enterEmail")} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">{t("auth.password")}</Label>
                        <Input id="password" type="password" placeholder={t("auth.enterPassword")} required />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("auth.signingIn") : t("auth.signIn")}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleAuth} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("auth.fullName")}</Label>
                        <Input id="name" placeholder={t("auth.enterFullName")} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">{t("auth.email")}</Label>
                        <Input id="signup-email" type="email" placeholder={t("auth.enterEmail")} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">{t("auth.password")}</Label>
                        <Input id="signup-password" type="password" placeholder={t("auth.createPassword")} required />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("auth.creatingAccount") : t("auth.createAccount")}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="grid gap-4">
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="font-semibold">{t("auth.features.moodTracking.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("auth.features.moodTracking.description")}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">{t("auth.features.professionalSupport.title")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("auth.features.professionalSupport.description")}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Shield className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">{t("auth.features.securePrivate.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("auth.features.securePrivate.description")}</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
