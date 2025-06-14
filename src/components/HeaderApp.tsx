"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Heart,
  Stethoscope,
  User,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../shared/stores/context/AuthContext";
import Image from "next/image";

enum AppRoutes {
  HOME = "/",
  AUTH = "/auth",
  DASHBOARD = "/dashboard",
  PROFILE = "/profile",
  NOT_FOUND = "*",
  MOOD = "/mood",
  DOCTORS = "/doctors",
}

interface NavItem {
  route: AppRoutes;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
}

// Navigation configuration
const navigationItems: NavItem[] = [
  {
    route: AppRoutes.DASHBOARD,
    icon: LayoutDashboard,
    labelKey: "navigation.dashboard",
  },
  {
    route: AppRoutes.MOOD,
    icon: Heart,
    labelKey: "navigation.moodTracker",
  },
  {
    route: AppRoutes.DOCTORS,
    icon: Stethoscope,
    labelKey: "navigation.doctors",
  },
  {
    route: AppRoutes.PROFILE,
    icon: User,
    labelKey: "navigation.profile",
  },
];

// Avatar Component
const UserAvatar = ({
  avatar,
  firstName,
  lastName,
  size = "md",
}: {
  avatar?: string;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white shadow-lg shadow-blue-500/20 cursor-pointer`}
    >
      {avatar ? (
        <Image
          src={avatar}
          width={50}
          height={50}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}
      <div
        className={`${
          avatar ? "hidden" : "flex"
        } w-full h-full bg-gradient-to-br from-[#155DFC] to-blue-600 text-white items-center justify-center font-semibold`}
      >
        {getInitials()}
      </div>
      {/* Always render initials as fallback, hidden initially if avatar exists */}
      {avatar && (
        <div className="hidden w-full h-full bg-gradient-to-br from-[#155DFC] to-blue-600 text-white items-center justify-center font-semibold absolute inset-0">
          {getInitials()}
        </div>
      )}
    </motion.div>
  );
};

const NavigationItem = ({
  item,
  isActive,
  href,
  onNavigation,
  isMobile = false,
}: {
  item: NavItem;
  isActive: boolean;
  href: string;
  onNavigation: (route: AppRoutes) => void;
  isMobile?: boolean;
}) => {
  const { t } = useTranslation();
  const Icon = item.icon;

  if (isMobile) {
    return (
      <Link
        href={href}
        className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
          isActive
            ? "bg-gradient-to-r from-[#155DFC] to-blue-600 text-white shadow-lg shadow-blue-500/20"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600"
        }`}
        onClick={() => onNavigation(item.route)}
      >
        <Icon
          className={`h-5 w-5 transition-all duration-300 ${
            isActive ? "text-white" : "text-gray-500"
          }`}
        />
        <span className="font-medium">{t(item.labelKey)}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={() => onNavigation(item.route)}
      className="relative px-6 py-3 rounded-full transition-all duration-300 group hover:scale-105"
    >
      {isActive && (
        <motion.div
          layoutId="activeNavBg"
          className="absolute inset-0 bg-gradient-to-r from-[#155DFC] to-blue-600 rounded-full shadow-lg shadow-blue-500/30"
          transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
        />
      )}
      <div className="relative z-10 flex items-center space-x-2">
        <Icon
          className={`h-5 w-5 transition-all duration-300 ${
            isActive
              ? "text-white"
              : "text-gray-500 group-hover:text-[#155DFC] group-hover:scale-110"
          }`}
        />
        <span
          className={`text-sm font-medium transition-all duration-300 ${
            isActive ? "text-white" : "text-gray-600 group-hover:text-[#155DFC]"
          }`}
        >
          {t(item.labelKey)}
        </span>
      </div>
    </Link>
  );
};

export const HeaderApp: React.FC = () => {
  const { user } = useAuth();
  const avatar = user?.avatar;
  const lastName = user?.lastName ?? "";
  const firstName = user?.firstName ?? "";
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const shouldHideNavigation = pathname.includes("/auth");

  const activeRoute = useMemo(() => {
    const cleanPath = pathname.replace(`/${locale}`, "") || "/";

    const matchedItem = navigationItems.find((item) => {
      if (
        item.route === AppRoutes.DASHBOARD &&
        (cleanPath === "/" || cleanPath === "/dashboard")
      )
        return true;
      else return cleanPath.includes(item.route) && item.route !== "/";
    });

    return matchedItem?.route || AppRoutes.DASHBOARD;
  }, [pathname, locale]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const getLocalizedPath = useCallback(
    (route: AppRoutes): string => {
      return `/${locale}${route === AppRoutes.HOME ? "" : route}`;
    },
    [locale]
  );

  const handleNavigation = useCallback((route: string) => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 mb-12 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-xl shadow-blue-500/5 border-b border-blue-100/20"
          : "bg-white/90 backdrop-blur-md"
      } ${shouldHideNavigation ? "hidden" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Logo - Left Side */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              href={getLocalizedPath(AppRoutes.DASHBOARD)}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Brain className="h-10 w-10 text-[#155DFC] transition-colors duration-300 group-hover:text-blue-600" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Sparkles className="h-4 w-4 text-blue-400 absolute -top-1 -right-1" />
                </motion.div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-[#155DFC] via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Sol
              </span>
            </Link>
          </motion.div>

          {/* Centered Navigation - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-3xl mx-auto">
            <motion.div
              className="flex items-center space-x-1 bg-gradient-to-r from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-full p-2 shadow-lg shadow-blue-500/10 border border-blue-100/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.route}
                  item={item}
                  isActive={activeRoute === item.route}
                  href={getLocalizedPath(item.route)}
                  onNavigation={handleNavigation}
                />
              ))}
            </motion.div>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden lg:flex items-center space-x-4">
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

              <LanguageSwitcher />
              <Link href={getLocalizedPath(AppRoutes.PROFILE)}>
                <UserAvatar
                  avatar={avatar}
                  firstName={firstName}
                  lastName={lastName}
                  size="md"
                />
              </Link>
            </div>

            <div className="lg:hidden flex items-center space-x-3">
              <LanguageSwitcher />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="relative rounded-full hover:bg-blue-50 transition-all duration-300 p-3"
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: 180, scale: 0 }}
                        transition={{ duration: 0.3, type: "spring" }}
                      >
                        <X className="h-6 w-6 text-gray-700" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: -180, scale: 0 }}
                        transition={{ duration: 0.3, type: "spring" }}
                      >
                        <Menu className="h-6 w-6 text-gray-700" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.25, 0, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <motion.div
                className="py-6 space-y-2 bg-white/95 backdrop-blur-xl rounded-3xl mt-4 mb-4 mx-2 shadow-xl shadow-blue-500/10 border border-blue-100/20"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
              >
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.route}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{
                      delay: (index + 1) * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <NavigationItem
                      item={item}
                      isActive={activeRoute === item.route}
                      href={getLocalizedPath(item.route)}
                      onNavigation={handleNavigation}
                      isMobile={true}
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: 0, type: "spring", stiffness: 100 }}
                  className="px-6 py-3 border-b border-blue-100/30"
                >
                  <Link
                    href={getLocalizedPath(AppRoutes.PROFILE)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-blue-50 transition-all duration-300"
                    onClick={() => handleNavigation(AppRoutes.PROFILE)}
                  >
                    <UserAvatar
                      avatar={avatar}
                      firstName={firstName}
                      lastName={lastName}
                      size="lg"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {firstName} {lastName}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
