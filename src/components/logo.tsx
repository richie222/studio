"use client";

import { HeartPulse } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <HeartPulse className="h-8 w-8 text-primary" />
      <span className="font-semibold text-xl sm:text-2xl text-primary">
        PetDoctor
      </span>
    </div>
  );
};

export default Logo;