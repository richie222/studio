
"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { HeartPulse, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialogContext } from '@/context/dialog-context';

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

  const { showDialog, closeDialog, dialogState } = useDialogContext();

  const router = useRouter();

  const handleVeterinarianClick = () => {
    showDialog({
      title: '¿Deseas registrarte?',
      description: '',
      buttons: [
        {
          label: 'No',
          onClick: () => closeDialog(),
        },
        {
          label: 'Si',
          onClick: () => {
            closeDialog();
            router.push('/veterinarian-register');
          },
        },
      ],
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 sm:p-6 border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <HeartPulse className="h-8 w-8 text-primary" />
                <span className="font-semibold text-xl sm:text-2xl text-primary">
                  PetWell
                </span>
              </div>
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
            <div className="flex items-center ml-auto space-x-2">
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  className="text-sm"
                  onClick={handleVeterinarianClick}
                >
                  ¿Sos Veterinario?
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  className="text-sm"
                >
                  ¿Sos Centro Médico Veterinario?
                </Button></div>
              <div><Button
                type="button"
                variant="secondary"
                className="text-sm"
              >
                ¿Ofreces algún servicio para mascotas?
              </Button>
            </div>
            </div>
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
        <div className="w-full max-w-md">
          {" "}
          {/* Removed space-y-8 as it has only one direct child now */}
          <div className="text-center space-y-8">
            <h1
              key={animationKey}
              className="text-4xl sm:text-5xl font-bold text-foreground animate-fadeIn"
              aria-live="polite"
            >
              {message || " "}
            </h1>
          </div>
        </div>
      </main>
      <Dialog open={dialogState.isOpen} onOpenChange={closeDialog}>
          <DialogContent className="sm:max-w-[425px]">
            {dialogState.options && (
                <DialogHeader>
                  <DialogTitle>{dialogState.options.title}</DialogTitle>
                  {dialogState.options.description && <DialogDescription>{dialogState.options.description}</DialogDescription>}
                </DialogHeader>
              )}
            {dialogState.options?.buttons && <DialogFooter>
                {dialogState.options.buttons.map((button, index) => (<Button key={index} onClick={button.onClick}>{button.label}</Button>))}</DialogFooter>}
          </DialogContent>
        </Dialog>
    </div>
  );
}
