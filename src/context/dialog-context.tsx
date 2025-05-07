"use client";

import { createContext, useContext, ReactNode, useCallback } from 'react';
import useDialog from '@/hooks/use-dialog';

export type DialogContextType = ReturnType<typeof useDialog> & {
  closeDialog: ()=> void;
};




interface DialogProviderProps {
  children: ReactNode;
}

export const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const dialog = useDialog();
  


  return (
    <DialogContext.Provider value={{...dialog, closeDialog: dialog.closeDialog}}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
};