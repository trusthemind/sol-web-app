"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { locales, type Locale } from "@/lib/i18n"

const languages = {
  en: { name: "English", flag: "🇺🇸" },
  ua: { name: "Українська", flag: "🇺🇦" },
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  // Get current locale from pathname
  const getCurrentLocale = (): Locale => {
    const segments = pathname.split('/')
    const localeFromPath = segments[1] as Locale
    return locales.includes(localeFromPath) ? localeFromPath : "en"
  }

  const currentLocale = getCurrentLocale()

  const switchLanguage = (newLocale: Locale) => {
    // Don't switch if it's the same locale
    if (newLocale === currentLocale) return

    // Remove current locale from pathname and add new one
    const pathSegments = pathname.split('/')
    const pathWithoutLocale = pathSegments.slice(2).join('/') // Remove first two segments: ['', 'locale']
    const newPath = `/${newLocale}/${pathWithoutLocale}`

    // Set locale cookie for persistence
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=lax`

    // Navigate to new path
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => switchLanguage(code as Locale)}
            className={`flex items-center gap-2 cursor-pointer ${
              currentLocale === code ? 'bg-accent' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {currentLocale === code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}