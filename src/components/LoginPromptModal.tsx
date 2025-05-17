
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginPromptModal = ({ isOpen, onClose, onLoginSuccess }: LoginPromptModalProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login', { state: { from: '/book', callback: onLoginSuccess } });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold">
            {language === 'en' ? 'Login Required' : 'يجب تسجيل الدخول للمتابعة'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center pt-4 pb-6">
          <p className="text-center mb-6 text-gray-600">
            {language === 'en' 
              ? 'You need to login to your account to book a consultation.' 
              : 'تحتاج إلى تسجيل الدخول إلى حسابك لحجز استشارة.'}
          </p>
          
          <Button 
            className="w-full mb-2 bg-agri hover:bg-agri-dark" 
            onClick={handleLogin}
          >
            {language === 'en' ? 'Login' : 'تسجيل الدخول'}
          </Button>
          
          <div className="mt-4 text-sm text-center">
            {language === 'en' ? "Don't have an account? " : 'ليس لديك حساب؟ '}
            <Link to="/signup" className="text-agri hover:underline" onClick={onClose}>
              {language === 'en' ? 'Sign up' : 'إنشاء حساب'}
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
