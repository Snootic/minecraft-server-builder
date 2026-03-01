import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { memo } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

export const LanguageSwitcher = memo(() => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      void i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const currentLang =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (code: string) => {
    void i18n.changeLanguage(code);
    localStorage.setItem("selectedLanguage", code);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5 cursor-pointer">
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">
          {currentLang.code}
        </span>
      </div>
      <div
        className={`absolute top-full right-0 pt-2 z-50 transition-all duration-100 ease-out ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="bg-slate-900 border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-40">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors hover:bg-white/5 ${
                lang.code === i18n.language ? "bg-white/10" : ""
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
