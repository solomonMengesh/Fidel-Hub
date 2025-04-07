import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(undefined);

// English translations
const enTranslations = {
  // Navigation
  "nav.home": "Home",
  "nav.courses": "Courses",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.login": "Log in",
  "nav.signup": "Sign up",
  "nav.dashboard": "Dashboard",
  "nav.logout": "Log out",
  "nav.myCourses": "My Courses",
  "nav.assignments": "Assignments",
  "nav.messages": "Messages",
  "nav.payments": "Payments",

  // Homepage
  "home.hero.title": "Learn Skills, Achieve Goals",
  "home.hero.subtitle":
    "Join thousands of students on Ethiopia's premier learning platform",
  "home.hero.cta": "Start Learning",
  "home.features.title": "Why Choose Fidel Hub",
  "home.testimonials.title": "What Our Students Say",
  "home.cta.title": "Ready to Transform Your Learning Experience?",
  "home.cta.description":
    "Join thousands of students who are already benefiting from our innovative platform. Start your learning journey today!",
  "home.cta.button1": "Get Started Now",
  "home.cta.button2": "Explore Courses",

  // Common
  language: "Language",
  english: "English",
  amharic: "Amharic",
  tigrinya: "Tigrinya",
  darkMode: "Dark Mode",
  lightMode: "Light Mode",
};

// Amharic translations
const amTranslations = {
  // Navigation
  "nav.home": "መነሻ",
  "nav.courses": "ኮርሶች",
  "nav.about": "ስለኛ",
  "nav.contact": "ያግኙን",
  "nav.login": "ግባ",
  "nav.signup": "ተመዝገብ",
  "nav.dashboard": "ዳሽቦርድ",
  "nav.logout": "ውጣ",
  "nav.myCourses": "የእኔ ኮርሶች",
  "nav.assignments": "የቤት ስራዎች",
  "nav.messages": "መልእክቶች",
  "nav.payments": "ክፍያዎች",

  // Homepage
  "home.hero.title": "ክህሎቶችን ይማሩ፣ ግቦችን ያሳኩ",
  "home.hero.subtitle": "በኢትዮጵያ ቀዳሚ የትምህርት መድረክ ላይ ከሺዎች ተማሪዎች ጋር ይቀላቀሉ",
  "home.hero.cta": "መማር ይጀምሩ",
  "home.features.title": "ፊደል ሀብን ለምን መረጡ",
  "home.testimonials.title": "ተማሪዎቻችን ምን ይላሉ",
  "home.cta.title": "የመማር ልምድዎን ለመለወጥ ዝግጁ ነዎት?",
  "home.cta.description":
    "ከዚህ ቀደም ከፈጠራዊ መድረካችን ጥቅም ከሚያገኙ ሺዎች ተማሪዎች ጋር ይቀላቀሉ። የመማር ጉዞዎን ዛሬ ይጀምሩ!",
  "home.cta.button1": "አሁን ይጀምሩ",
  "home.cta.button2": "ኮርሶችን ያስሱ",

  // Common
  language: "ቋንቋ",
  english: "እንግሊዘኛ",
  amharic: "አማርኛ",
  tigrinya: "ትግርኛ",
  darkMode: "ጨለማ ሁነታ",
  lightMode: "ብርሃን ሁነታ",
};

// Tigrinya translations
const tiTranslations = {
  // Navigation
  "nav.home": "መበገሲ",
  "nav.courses": "ኮርሳት",
  "nav.about": "ብዛዕባና",
  "nav.contact": "ርኸቡና",
  "nav.login": "እቶ",
  "nav.signup": "ተመዝገብ",
  "nav.dashboard": "ዳሽቦርድ",
  "nav.logout": "ውጻእ",
  "nav.myCourses": "ኮርሳተይ",
  "nav.assignments": "ዕዮታት",
  "nav.messages": "መልእኽቲታት",
  "nav.payments": "ክፍሊታት",

  // Homepage
  "home.hero.title": "ክእለታት ተማሃር፣ ዕላማታት ኣውን",
  "home.hero.subtitle": "ምስ ኣሽሓት ተማሃሮ ኣብ ፈላሚ መንበር ትምህርታዊ መድረኽ ኢትዮጵያ ተሳተፍ",
  "home.hero.cta": "ምምሃር ጀምር",
  "home.features.title": "ንምንታይ ፊደል ሀብ ትመርጹ",
  "home.testimonials.title": "ተማሃሮና እንታይ ይብሉ",
  "home.cta.title": "ንምምሃር ተመኩሮኹም ንምቕያር ድሉዋት ዲኹም?",
  "home.cta.description":
    "ምስ ኣሽሓት ተማሃሮ ካብ ፈጠራዊ መድረኽና ጥቕሚ ዝረኽቡ ዘለዉ ተሳተፉ። ጉዕዞ ምምሃርኩም ሎሚ ጀምሩ!",
  "home.cta.button1": "ሕጂ ጀምር",
  "home.cta.button2": "ኮርሳት ርኣዩ",

  // Common
  language: "ቋንቋ",
  english: "እንግሊዝኛ",
  amharic: "ኣምሓርኛ",
  tigrinya: "ትግርኛ",
  darkMode: "ጸልማት ዓይነት",
  lightMode: "ብርሃን ዓይነት",
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem("fidelhub-language");
    return savedLanguage || "en";
  });

  useEffect(() => {
    localStorage.setItem("fidelhub-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage);
  };

  const t = (key) => {
    let translations;
    switch (language) {
      case "en":
        translations = enTranslations;
        break;
      case "am":
        translations = amTranslations;
        break;
      case "ti":
        translations = tiTranslations;
        break;
      default:
        translations = enTranslations;
    }
    return translations[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
