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
import { LanguageSwitcher } from "@/src/components/header/LanguageSwitcher";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../shared/stores/context/AuthContext";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import clsx from "clsx";

// Constants and Types
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

interface UserAvatarProps {
  avatar?: string;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}

interface NavigationItemProps {
  item: NavItem;
  isActive: boolean;
  href: string;
  onNavigation: (route: AppRoutes) => void;
  isMobile?: boolean;
}

// Constants
const NAVIGATION_ITEMS: NavItem[] = [
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

const AVATAR_SIZE_CLASSES = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
} as const;

const SCROLL_THRESHOLD = 10;

// Animation variants for better performance
const menuVariants = {
  closed: { opacity: 0, height: 0, y: -20 },
  open: { opacity: 1, height: "auto", y: 0 },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      type: "spring",
      stiffness: 100,
    },
  }),
};

// Optimized UserAvatar Component
const UserAvatar = ({
  avatar,
  firstName,
  lastName,
  size = "md",
}: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const initials = useMemo(() => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  }, [firstName, lastName]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const sizeClass = AVATAR_SIZE_CLASSES[size];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative ${sizeClass} rounded-full overflow-hidden border-2 border-white shadow-lg shadow-blue-500/20 cursor-pointer`}
      role="button"
      tabIndex={0}
      aria-label={`${firstName} ${lastName} profile`}
    >
      {avatar && !imageError ? (
        <Image
          src={avatar}
          width={size === "lg" ? 48 : size === "md" ? 40 : 32}
          height={size === "lg" ? 48 : size === "md" ? 40 : 32}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
          priority={size === "md"} // Prioritize main avatar
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#155DFC] to-blue-600 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>
      )}
    </motion.div>
  );
};

// Optimized NavigationItem Component
const NavigationItem = ({
  item,
  isActive,
  href,
  onNavigation,
  isMobile = false,
}: NavigationItemProps) => {
  const { t } = useTranslation();
  const Icon = item.icon;

  const handleClick = useCallback(() => {
    onNavigation(item.route);
  }, [item.route, onNavigation]);

  const baseClasses = "flex items-center transition-all duration-300 transform";
  const activeClasses = isActive
    ? "bg-gradient-to-r from-[#155DFC] to-blue-600 text-white shadow-lg shadow-blue-500/20"
    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600";

  if (isMobile) {
    return (
      <Link
        href={href}
        className={`${baseClasses} space-x-3 px-6 py-3 rounded-xl hover:scale-[1.02] ${activeClasses}`}
        onClick={handleClick}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon
          className={`h-5 w-5 transition-all duration-300 ${
            isActive ? "text-white" : "text-gray-500"
          }`}
          aria-hidden="true"
        />
        <span className="font-medium">{t(item.labelKey)}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="relative px-6 py-3 rounded-full transition-all duration-300 group hover:scale-105"
      aria-current={isActive ? "page" : undefined}
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
          aria-hidden="true"
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

export const HeaderApp = () => {
  const { user } = useAuth();
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Memoized values
  const shouldHideNavigation = useMemo(
    () => pathname.includes("/auth"),
    [pathname]
  );

  const userInfo = useMemo(
    () => ({
      avatar: user?.avatar,
      lastName: user?.lastName ?? "",
      firstName: user?.firstName ?? "",
    }),
    [user?.avatar, user?.lastName, user?.firstName]
  );

  const activeRoute = useMemo(() => {
    const cleanPath = pathname.replace(`/${locale}`, "") || "/";

    const matchedItem = NAVIGATION_ITEMS.find((item) => {
      if (
        item.route === AppRoutes.DASHBOARD &&
        (cleanPath === "/" || cleanPath === "/dashboard")
      ) {
        return true;
      }
      return cleanPath.includes(item.route) && item.route !== "/";
    });

    return matchedItem?.route || AppRoutes.DASHBOARD;
  }, [pathname, locale]);

  // Optimized scroll handler with throttling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Memoized callbacks
  const getLocalizedPath = useCallback(
    (route: AppRoutes): string => {
      return `/${locale}${route === AppRoutes.HOME ? "" : route}`;
    },
    [locale]
  );

  const handleNavigation = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  if (shouldHideNavigation) return null;

  const headerClasses = clsx(
    `absoulte top-0 left-0 right-0 z-50 transition-all duration-500`,
    scrolled
      ? "bg-white/95 backdrop-blur-xl shadow-xl shadow-blue-500/5 border-b border-blue-100/20"
      : "bg-white/90 backdrop-blur-md"
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className={headerClasses}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              href={getLocalizedPath(AppRoutes.DASHBOARD)}
              className="flex items-center space-x-3 group"
              aria-label="Sol - Go to dashboard"
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-3xl mx-auto">
            <motion.div
              className="flex items-center space-x-1 bg-gradient-to-r from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-full p-2 shadow-lg shadow-blue-500/10 border border-blue-100/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              role="menubar"
            >
              {NAVIGATION_ITEMS.map((item) => (
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

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <LanguageSwitcher />
              <Link
                href={getLocalizedPath(AppRoutes.PROFILE)}
                aria-label="Go to profile"
              >
                <UserAvatar
                  avatar={userInfo.avatar}
                  firstName={userInfo.firstName}
                  lastName={userInfo.lastName}
                  size="md"
                />
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-3">
              <LanguageSwitcher />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="relative rounded-full hover:bg-blue-50 transition-all duration-300 p-3"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
              id="mobile-menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.4, ease: [0.25, 0.25, 0, 1] }}
              className="lg:hidden overflow-hidden"
              role="menu"
            >
              <motion.div
                className="py-6 space-y-2 bg-white/95 backdrop-blur-xl rounded-3xl mt-4 mb-4 mx-2 shadow-xl shadow-blue-500/10 border border-blue-100/20"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
              >
                {NAVIGATION_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.route}
                    custom={index}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
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

                {/* Mobile Profile */}
                <motion.div
                  custom={NAVIGATION_ITEMS.length}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="px-6 py-3 border-t border-blue-100/30 mt-4"
                >
                  <Link
                    href={getLocalizedPath(AppRoutes.PROFILE)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-blue-50 transition-all duration-300"
                    onClick={handleNavigation}
                    aria-label="Go to profile"
                  >
                    <UserAvatar
                      avatar={userInfo.avatar}
                      firstName={userInfo.firstName}
                      lastName={userInfo.lastName}
                      size="lg"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {userInfo.firstName} {userInfo.lastName}
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
