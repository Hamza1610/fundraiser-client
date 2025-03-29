// components/APIErrorHandler.tsx
import { Dialog, Title, Description, Portal, Overlay, Content } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface APIErrorHandlerProps {
  error: string | null;
  onClose: () => void;
  isOpen: boolean;
}

export const APIErrorHandler = ({
  error,
  onClose,
  isOpen,
}: APIErrorHandlerProps) => {
  const [internalError, setInternalError] = useState(error);

  useEffect(() => {
    if (isOpen) {
      setInternalError(error);
    }
  }, [error, isOpen]);

  const handleClose = () => {
    setInternalError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <Portal>
        <Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Content
          className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 
                    rounded-lg bg-white p-6 shadow-lg focus:outline-none"
        >
          <div className="flex items-center justify-between mb-4">
            <Title className="text-lg font-semibold text-red-600">
              Operation Failed
            </Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Description className="text-gray-700 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">●</span>
              {internalError || 'An unexpected error occurred'}
            </div>
          </Description>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 
                      transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </Content>
      </Portal>
    </Dialog>
  );
};