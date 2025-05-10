"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from '@/components/logo';
import { useDialogContext } from '@/context/dialog-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { showDialog, closeDialog, dialogState } = useDialogContext();

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://doctorpet.onrender.com/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
    // Log para debugging
    console.log('Cookies:', document.cookie);
    console.log('Response status:', response.status);
      if (response.status === 200) {
        console.log("Login successful:", data);
        showDialog({
          title: data.message,
          description: 'Bienvenido: ' + data.user.email,
          buttons: [
            {
              label: 'Ok',
              onClick: () => {
                closeDialog();
                router.push('/');
              },
            },
          ],
        })
      } else if (response.status === 401) {
        console.error("Error: ", data.error);
        showDialog({
          title: 'Error',
          description: data.error,
          buttons: [
            {
              label: 'Ok',
              onClick: () => closeDialog(),
            },
          ],
        })
      } else {
        console.error("Unexpected error:", data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleCancel = () => {
    showDialog({
      title: '¿Deseas cancelar el inicio de sesión?',
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
            router.push('/');
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <header className="p-4">
          <div className="container mx-auto">
              <Logo/>
          </div>
      </header>
      <div className="bg-background p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            
              <Input
                id="email"
                type="email"
                autoCapitalize="none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-4"
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleLogin} >
              Iniciar Sesión
            </Button>
          </div>
      </div>
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