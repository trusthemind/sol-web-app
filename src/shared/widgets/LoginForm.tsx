"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  createLoginSchema,
  LoginFormData,
} from "../../utils/validation/login.schema";
import { GoogleIcon } from "../../components/icon/GoogleIcon";
import { AuthApi } from "../api/auth.api";
import { AppRoutes } from "../constants/navigation";
import { toast } from "sonner";
import { setCookie } from "../api";
import { AuthCookies } from "../types/Cookies.type";
import { useAuth } from "../stores/context/AuthContext";

interface LoginFormProps {
  isLoading?: boolean;
}

export default function LoginForm({ isLoading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const { push } = useRouter();

  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      const res = await AuthApi.login(data);
      console.log(res?.data);
      const { token, user } = res?.data;
      if (token)
        if (token) {
          setCookie(AuthCookies.AUTH_TOKEN, token);
          login({ user, token });
        }
    } catch (_) {
      toast.error("Login have been failed");
    } finally {
      push(AppRoutes.DASHBOARD);
    }
  };

  const loading = isLoading || isSubmitting;

  return (
    <motion.form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3">
        <Label
          htmlFor="email"
          className={clsx(
            "text-white font-medium text-base flex items-center gap-2",
            errors.email && "text-red-300"
          )}
        >
          <Mail className="h-4 w-4" />
          {t("auth.email")}
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder={t("auth.enterEmail")}
            {...register("email")}
            className={clsx(
              "h-12 text-base transition-all duration-300 pl-4",
              "bg-white/10 border-white/20 text-white",
              "placeholder:text-slate-400",
              "focus:border-blue-400 focus:ring-blue-400/20",
              errors.email &&
                "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
            )}
          />
          {errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-300 text-sm font-medium ml-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Password Field */}
      <div className="space-y-3">
        <Label
          htmlFor="password"
          className={clsx(
            "text-white font-medium text-base flex items-center gap-2",
            errors.password && "text-red-300"
          )}
        >
          <Lock className="h-4 w-4" />
          {t("auth.password")}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.enterPassword")}
            {...register("password")}
            className={clsx(
              "h-12 text-base pr-12 transition-all duration-300",
              "bg-white/10 border-white/20 text-white",
              "placeholder:text-slate-400",
              "focus:border-blue-400 focus:ring-blue-400/20",
              errors.password &&
                "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={clsx(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "h-8 w-8 p-0 text-slate-400 hover:text-white transition-colors"
            )}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-300 text-sm font-medium ml-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className={clsx(
          "w-full py-4 text-base font-semibold rounded-xl",
          "bg-gradient-to-r from-blue-500 to-indigo-500",
          "hover:from-blue-600 hover:to-indigo-600",
          "text-white shadow-lg hover:shadow-blue-500/25",
          "transform transition-all duration-300",
          "hover:scale-105 disabled:hover:scale-100",
          "disabled:opacity-70 disabled:cursor-not-allowed"
        )}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center space-x-2"
            >
              <motion.div
                className={clsx(
                  "w-4 h-4 rounded-full",
                  "border-2 border-white/30 border-t-white"
                )}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span>{t("auth.signingIn")}</span>
            </motion.div>
          ) : (
            <motion.div
              key="signin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center space-x-2"
            >
              <span>{t("auth.signIn")}</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <Button
        type="button"
        variant="outline"
        className={clsx(
          "w-full h-12 bg-white/10 border-white/20 [&&]:text-white",
          "hover:bg-white/20 [&&]:hover:border-white/20"
        )}
      >
        <GoogleIcon />
        Google
      </Button>
    </motion.form>
  );
}
