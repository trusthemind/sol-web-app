"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/shared/hooks/useTranslation";

export default function HomePage() {
  const router = useRouter();
  const { locale } = useTranslation();

  useEffect(() => {
    router.push(`/${locale}/dashboard`);
  }, [router, locale]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      </div>
    </div>
  );
}
