
"use client";

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { HeartPulse, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function HomePage() {
  const [message, setMessage] = useState<string>("Hello, World!");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [animationKey, setAnimationKey] = useState<number>(0);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setAnimationKey(prevKey => prevKey + 1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setAnimationKey(prevKey => prevKey + 1);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 sm:p-6 border-b">
        <div className="container mx-auto">
          {/* Top row for larger screens: Logo, Search, Other actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-6 flex-shrink-0"> {/* Group for Logo and Desktop Search */}
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <HeartPulse className="h-8 w-8 text-primary" />
                <span className="font-semibold text-xl sm:text-2xl text-primary">PetWell</span>
              </div>
              {/* Desktop Search Bar (md and up) */}
              <div className="relative hidden md:block md:w-64 lg:w-80 xl:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full rounded-full border-input bg-background px-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Search PetWell"
                />
              </div>
            </div>

            {/* Placeholder for other header items on the far right (e.g., User Menu, Notifications) */}
            <div className="flex items-center space-x-2">
              {/* Future header items can go here */}
            </div>
          </div>

          {/* Mobile Search Bar (below logo/actions row, visible on <md screens) */}
          <div className="mt-4 md:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-full border-input bg-background px-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Search PetWell"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md"> {/* Removed space-y-8 as it has only one direct child now */}
          <div className="text-center space-y-8">
            <h1
              key={animationKey}
              className="text-4xl sm:text-5xl font-bold text-foreground animate-fadeIn"
              aria-live="polite"
            >
              {message || " "}
            </h1>
            
            <div className="space-y-3">
              <Label htmlFor="message-input" className="block text-sm font-medium text-muted-foreground">
                Customize your greeting:
              </Label>
              <Input
                id="message-input"
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Enter your message"
                className="w-full rounded-md border-input bg-card px-4 py-3 text-center text-base sm:text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Customize Greeting Message"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
