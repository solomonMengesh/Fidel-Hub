import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const popularTags = ['Web Development', 'Data Science', 'UX Design', 'Marketing', 'AI & ML'];

  return (
    <div className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-20 lg:pt-40 lg:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient -z-10"></div>
      
      {/* Floating circles decoration */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/10 -z-10 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-down">
            Expand Your Knowledge <br /> Through <span className="text-primary">Online Learning</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            Discover thousands of high-quality courses taught by industry experts and enhance your skills at your own pace.
          </p>
          
          <div className="relative max-w-xl mx-auto animate-slide-down" style={{ animationDelay: '0.2s' }}>
            <div className="relative glassmorphism p-1 rounded-full shadow-subtle">
              <input 
                type="text" 
                placeholder="What do you want to learn today?" 
                className="w-full bg-transparent pl-5 pr-32 py-4 rounded-full focus:outline-none"
                aria-label="Search courses"
              />
              <Button className="absolute right-1 top-1 bottom-1 px-5 rounded-full" aria-label="Search">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-3 text-muted-foreground animate-slide-down" style={{ animationDelay: '0.3s' }}>
            <span>Popular:</span>
            {popularTags.map((tag) => (
              <a 
                key={tag} 
                href={`/courses?q=${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1 bg-secondary rounded-full text-sm hover:bg-primary/10 transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
