"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

enum Languages {
  EN = "en",
  UA = "ua",
}

interface LanguageConfig {
  code: Languages;
  name: string;
  nativeName: string;
  flag: string;
}

const languageConfigs: Record<Languages, LanguageConfig> = {
  [Languages.EN]: {
    code: Languages.EN,
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  [Languages.UA]: {
    code: Languages.UA,
    name: "Ukrainian",
    nativeName: "Українська",
    flag: "🇺🇦",
  },
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const getCurrentLocale = (): Locale => {
    const segments = pathname.split("/");
    const localeFromPath = segments[1] as Locale;
    return locales.includes(localeFromPath) ? localeFromPath : Languages.EN;
  };

  const currentLocale = getCurrentLocale() as Languages;
  const currentLanguage = languageConfigs[currentLocale];

  const switchLanguage = async (newLocale: Languages) => {
    if (newLocale === currentLocale) return;

    setIsChanging(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    const pathSegments = pathname.split("/");
    const pathWithoutLocale = pathSegments.slice(2).join("/");
    const newPath = `/${newLocale}/${pathWithoutLocale}`;

    document.cookie = `locale=${newLocale}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; SameSite=lax`;

    router.push(newPath);
    setIsChanging(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 px-3 hover:bg-gray-100 rounded-full transition-all duration-200 group"
        >
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-600 group-hover:text-[#155DFC] transition-colors" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
              {currentLanguage.flag}
            </span>
            <ChevronDown
              className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            align="end"
            className="w-56 p-1 rounded-xl shadow-lg border border-gray-500"
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {Object.values(languageConfigs).map((lang) => {
                const isActive = currentLocale === lang.code;

                return (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    disabled={isChanging}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
                      transition-all duration-200 mx-1 mb-1 text-black hover:text-white 
                      ${
                        isActive
                          ? "bg-[#155DFC]/10 text-[#155DFC]"
                          : "hover:white-red text-gray-700"
                      }
                      ${isChanging ? "opacity-50" : "opacity-100"}
                    `}
                  >
                    <div className="w-[80%] flex items-center justify-between gap-2">
                      <span
                        className="text-xl"
                        role="img"
                        aria-label={lang.name}
                      >
                        {lang.flag}
                      </span>
                      <p className={`text-sm font-medium`}>{lang.nativeName}</p>
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <div className="h-5 w-5 rounded-full bg-[#155DFC] flex items-center justify-center">
                          <Check
                            className="h-3 w-3 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      </motion.div>
                    )}
                  </DropdownMenuItem>
                );
              })}

              {isChanging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center"
                >
                  <div className="h-5 w-5 border-t-transparent rounded-full animate-spin" />
                </motion.div>
              )}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}
