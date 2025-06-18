"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";

interface DailyQuote {
  text: string;
  author: string;
}

const quotes = {
  en: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" }
  ],
  ua: [
    { text: "Єдиний спосіб робити велику роботу - любити те, що ви робите.", author: "Стів Джобс" },
    { text: "Життя - це те, що з вами трапляється, поки ви зайняті плануванням.", author: "Джон Леннон" },
    { text: "Майбутнє належить тим, хто вірить у красу своїх мрій.", author: "Елеонора Рузвельт" },
    { text: "Зрештою, ми запам'ятаємо не слова наших ворогів, а мовчання наших друзів.", author: "Мартін Лютер Кінг-молодший" },
    { text: "Єдина неможлива подорож - та, яку ви ніколи не почнете.", author: "Тоні Роббінс" },
    { text: "Успіх не остаточний, невдача не фатальна: важлива відвага продовжувати.", author: "Вінстон Черчілль" },
    { text: "Розум - це все. Чим ви думаете, тим ви стаєте.", author: "Будда" },
    { text: "Ви ніколи не занадто старі, щоб поставити нову ціль або помріяти новою мрією.", author: "К.С. Льюїс" },
    { text: "Повірте, що можете, і ви вже на півдорозі.", author: "Теодор Рузвельт" },
    { text: "Неважливо, як повільно ви йдете, поки ви не зупиняєтесь.", author: "Конфуцій" }
  ]
};

export default function QuoteOfTheDay() {
  const { locale } = useTranslation();
  const [quote, setQuote] = useState<DailyQuote | null>(null);

  useEffect(() => {
    // Get quote based on current date to ensure same quote per day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const quotesForLocale = quotes[locale as keyof typeof quotes] || quotes.en;
    const todaysQuote = quotesForLocale[dayOfYear % quotesForLocale.length];
    
    setQuote(todaysQuote);
  }, [locale]);

  if (!quote) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start gap-4">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Quote className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  {locale === "ua" ? "Цитата дня" : "Quote of the Day"}
                </h3>
                <blockquote className="text-slate-700 italic text-base leading-relaxed mb-3">
                  "{quote.text}"
                </blockquote>
                <cite className="text-slate-600 font-medium text-sm not-italic">
                  — {quote.author}
                </cite>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}