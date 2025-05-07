
"use client";

import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [message, setMessage] = useState<string>("Hello, World!");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [animationKey, setAnimationKey] = useState<number>(0);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    // Increment key to re-trigger animation on the h1 element
    setAnimationKey(prevKey => prevKey + 1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Trigger animation on initial load
  useEffect(() => {
    setAnimationKey(prevKey => prevKey + 1);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 sm:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-md border-input bg-card py-3 pl-10 pr-4 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Search"
          />
        </div>
        
        <div className="text-center space-y-8">
          <h1
            key={animationKey} // Changing the key re-mounts the component, re-triggering the animation
            className="text-4xl sm:text-5xl font-bold text-foreground animate-fadeIn"
            aria-live="polite" // Announce changes to screen readers
          >
            {message || " "} {/* Display message, use space to maintain height if empty for animation */}
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
  );
}

