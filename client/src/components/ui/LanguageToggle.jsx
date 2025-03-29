import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return React.createElement(
    DropdownMenu,
    null,
    React.createElement(
      DropdownMenuTrigger,
      { asChild: true },
      React.createElement(
        Button,
        { variant: "outline", size: "icon" },
        React.createElement(Languages, { className: "h-[1.2rem] w-[1.2rem]" }),
        React.createElement("span", { className: "sr-only" }, t("language"))
      )
    ),
    React.createElement(
      DropdownMenuContent,
      { align: "end" },
      React.createElement(
        DropdownMenuItem,
        {
          onClick: () => setLanguage("en"),
          className: language === "en" ? "bg-accent" : "",
        },
        t("english")
      ),
      React.createElement(
        DropdownMenuItem,
        {
          onClick: () => setLanguage("am"),
          className: language === "am" ? "bg-accent" : "",
        },
        t("amharic")
      ),
      React.createElement(
        DropdownMenuItem,
        {
          onClick: () => setLanguage("ti"),
          className: language === "ti" ? "bg-accent" : "",
        },
        t("tigrinya")
      )
    )
  );
};

export default LanguageToggle;
