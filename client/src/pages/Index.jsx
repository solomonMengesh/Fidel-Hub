import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import PopularCourses from "@/components/home/PopularCourses";
import CallToAction from "@/components/home/CallToAction";
import Testimonials from "@/components/home/Testimonials";
import ThemeToggle from "@/components/ui/ThemeToggle";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <PopularCourses />
        <CallToAction />
        <Testimonials />
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Index;
