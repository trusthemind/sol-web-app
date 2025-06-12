"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import clsx from "clsx";

// Password strength validation
const passwordRegex = {
  minLength: /.{8,}/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

// Validation schema
const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(passwordRegex.hasUpperCase, "Password must contain at least one uppercase letter")
    .matches(passwordRegex.hasLowerCase, "Password must contain at least one lowercase letter")
    .matches(passwordRegex.hasNumber, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit?: (data: Omit<RegisterFormData, 'confirmPassword' | 'termsAccepted'>) => Promise<void> | void;
  isLoading?: boolean;
}

export default function RegisterForm({ onSubmit, isLoading = false }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t, locale } = useTranslation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password");

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, checks: [] };
    
    const checks = [
      { key: 'minLength', label: 'At least 8 characters', passed: passwordRegex.minLength.test(password) },
      { key: 'hasUpperCase', label: 'One uppercase letter', passed: passwordRegex.hasUpperCase.test(password) },
      { key: 'hasLowerCase', label: 'One lowercase letter', passed: passwordRegex.hasLowerCase.test(password) },
      { key: 'hasNumber', label: 'One number', passed: passwordRegex.hasNumber.test(password) },
    ];
    
    const score = checks.filter(check => check.passed).length;
    return { score, checks };
  };

  const passwordStrength = getPasswordStrength(password || "");

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      if (onSubmit) {
        await onSubmit({
          email: data.email,
          password: data.password,
        });
      } else {
        // Default behavior - simulate registration
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 1500);
      }
    } catch (error: any) {
      // Handle registration errors
      if (error.field) {
        setError(error.field, { message: error.message });
      } else {
        setError("root", { message: error.message || "Registration failed" });
      }
    }
  };

  const loading = isLoading || isSubmitting;

  return (
    <motion.form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Root Error Display */}
      {errors.root && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={clsx(
            "p-4 rounded-xl border border-red-200/50",
            "bg-red-50/80 backdrop-blur-sm",
            "text-red-700 text-sm font-medium"
          )}
        >
          {errors.root.message}
        </motion.div>
      )}

      {/* Email Field */}
      <div className="space-y-3">
        <Label
          htmlFor="register-email"
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
            id="register-email"
            type="email"
            placeholder={t("auth.enterEmail")}
            {...register("email")}
            className={clsx(
              "h-12 text-base transition-all duration-300",
              "bg-white/10 border-white/20 text-white",
              "placeholder:text-slate-400",
              "focus:border-indigo-400 focus:ring-indigo-400/20",
              errors.email && "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
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
          htmlFor="register-password"
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
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.createPassword")}
            {...register("password")}
            className={clsx(
              "h-12 text-base pr-12 transition-all duration-300",
              "bg-white/10 border-white/20 text-white",
              "placeholder:text-slate-400",
              "focus:border-indigo-400 focus:ring-indigo-400/20",
              errors.password && "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
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

        {/* Password Strength Indicator */}
        {password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3"
          >
            {/* Strength Bar */}
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={clsx(
                    "h-2 flex-1 rounded-full transition-all duration-300",
                    passwordStrength.score >= level
                      ? passwordStrength.score === 1
                        ? "bg-red-400"
                        : passwordStrength.score === 2
                        ? "bg-yellow-400"
                        : passwordStrength.score === 3
                        ? "bg-blue-400"
                        : "bg-green-400"
                      : "bg-white/20"
                  )}
                />
              ))}
            </div>

            {/* Strength Checks */}
            <div className="grid grid-cols-2 gap-2">
              {passwordStrength.checks.map((check) => (
                <motion.div
                  key={check.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={clsx(
                    "flex items-center gap-2 text-xs",
                    check.passed ? "text-green-300" : "text-slate-400"
                  )}
                >
                  <div
                    className={clsx(
                      "w-3 h-3 rounded-full flex items-center justify-center",
                      check.passed ? "bg-green-400" : "bg-white/20"
                    )}
                  >
                    {check.passed && <Check className="w-2 h-2 text-white" />}
                  </div>
                  <span>{check.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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

      {/* Confirm Password Field */}
      <div className="space-y-3">
        <Label
          htmlFor="confirm-password"
          className={clsx(
            "text-white font-medium text-base flex items-center gap-2",
            errors.confirmPassword && "text-red-300"
          )}
        >
          <Lock className="h-4 w-4" />
          {t("auth.confirmPassword")}
        </Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            {...register("confirmPassword")}
            className={clsx(
              "h-12 text-base pr-12 transition-all duration-300",
              "bg-white/10 border-white/20 text-white",
              "placeholder:text-slate-400",
              "focus:border-indigo-400 focus:ring-indigo-400/20",
              errors.confirmPassword && "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <AnimatePresence>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-300 text-sm font-medium ml-1"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="termsAccepted"
            {...register("termsAccepted")}
            className={clsx(
              "mt-1 w-4 h-4 rounded border-2 transition-all duration-200",
              "bg-white/10 border-white/30 text-indigo-500",
              "focus:ring-indigo-400/20 focus:border-indigo-400",
              errors.termsAccepted && "border-red-400 focus:border-red-400"
            )}
          />
          <Label
            htmlFor="termsAccepted"
            className={clsx(
              "text-sm text-slate-300 leading-relaxed cursor-pointer",
              errors.termsAccepted && "text-red-300"
            )}
          >
            I agree to the{" "}
            <button
              type="button"
              className="text-blue-300 hover:text-blue-200 underline underline-offset-2"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-blue-300 hover:text-blue-200 underline underline-offset-2"
            >
              Privacy Policy
            </button>
          </Label>
        </div>
        <AnimatePresence>
          {errors.termsAccepted && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-300 text-sm font-medium ml-7"
            >
              {errors.termsAccepted.message}
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
          "bg-gradient-to-r from-indigo-500 to-blue-600",
          "hover:from-indigo-600 hover:to-blue-700",
          "text-white shadow-lg hover:shadow-indigo-500/25",
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
              <span>{t("auth.creatingAccount")}</span>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center space-x-2"
            >
              <span>{t("auth.createAccount")}</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Additional Info */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-slate-400">
              {t("auth.orContinueWith")}
            </span>
          </div>
        </div>

        {/* Social Registration Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className={clsx(
              "h-12 bg-white/10 border-white/20 text-white",
              "hover:bg-white/20 hover:border-white/30"
            )}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className={clsx(
              "h-12 bg-white/10 border-white/20 text-white",
              "hover:bg-white/20 hover:border-white/30"
            )}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={clsx(
            "text-xs text-slate-400 leading-relaxed",
            "bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
          )}
        >
          🔒 Your information is encrypted and secure. We'll never share your data with third parties.
        </motion.div>
      </div>
    </motion.form>
  );
}