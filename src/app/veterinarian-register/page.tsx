"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDialogContext } from '@/context/dialog-context';
import { useRouter } from 'next/navigation';
import Logo from '@/components/logo';

const VeterinarianRegisterPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const { showDialog, closeDialog, dialogState } = useDialogContext();
  const router = useRouter();
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Image:', image);
  };
  const handleCancel = () => {
    showDialog({
      title: '¿Estas seguro de cancelar el registro?',
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
    <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="p-4">
            <div className="container mx-auto">
                <Logo/>
            </div>
        </header>
        <main className="flex-1 flex items-center justify-center"> <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register Veterinarian
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <Button
              type="button"
              variant={'destructive'}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              
            >
              Submit
            </Button>
          </div>
          
        </form>
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
};

export default VeterinarianRegisterPage;