import React from 'react';
import { AlertTriangle, CheckCircle, Send } from 'lucide-react';
import { Button } from './Button';


type AlertType = 'error' | 'success' | 'confirm';

interface AlertModalProps {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "ACEPTAR",
  cancelText = "CANCELAR"
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error': return <AlertTriangle size={32} strokeWidth={2.5} />;
      case 'success': return <CheckCircle size={32} strokeWidth={2.5} />;
      case 'confirm': return <Send size={32} strokeWidth={2.5} className="ml-1" />;
      default: return <AlertTriangle size={32} strokeWidth={2.5} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100 p-8 flex flex-col items-center text-center">
        
        {/* Icono con tu color 'acento' */}
        <div className="w-16 h-16 bg-acento/10 text-acento rounded-full flex items-center justify-center mb-5 shadow-inner">
          {getIcon()}
        </div>

        {/* Títulos y Mensajes */}
        <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">
          {title}
        </h3>
        <div className="text-sm text-gray-500 mb-8 leading-relaxed">
          {message}
        </div>

        {/* Botonera */}
        <div className="flex gap-3 w-full">
          {type === 'confirm' && (
            <Button 
              variant="gris" 
              onClick={onCancel} 
              className="flex-1 py-3 font-bold uppercase"
            >
              {cancelText}
            </Button>
          )}
          <Button 
            variant="primario" 
            onClick={onConfirm} 
            className="flex-1 py-3 font-bold shadow-md shadow-acento/20 uppercase !bg-acento hover:brightness-90"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};