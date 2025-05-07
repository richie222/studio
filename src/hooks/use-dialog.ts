import { useState, useCallback } from 'react';

interface DialogButton {
  label: string;
  onClick: () => void;
}

interface DialogOptions {
  title: string;
  description: string;
  buttons: DialogButton[];
}

interface DialogState {
  isOpen: boolean;
  options: DialogOptions | null;
}

const useDialog = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    options: null,
  });

  const showDialog = useCallback((options: DialogOptions) => {
    setDialogState({
      isOpen: true,
      options,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({
      isOpen: false,
      options: null,
    });
  }, []);

  return {
    showDialog,
    closeDialog,
    dialogState,
  };
};

export default useDialog;