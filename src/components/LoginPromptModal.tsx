
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, UserPlus } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  message?: string;
}

export const LoginPromptModal = ({ isOpen, onClose, onLoginSuccess, message }: LoginPromptModalProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogin = () => {
    navigate('/login', { state: { from: location.pathname, callback: onLoginSuccess } });
    onClose();
  };
  
  const handleSignup = () => {
    navigate('/signup', { state: { from: location.pathname } });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold">
            {language === 'en' ? 'Login Required' : 'يجب تسجيل الدخول للمتابعة'}
          </DialogTitle>
          <DialogDescription>
            {message || (language === 'en' 
              ? 'You need to login to your account to continue.' 
              : 'تحتاج إلى تسجيل الدخول إلى حسابك للمتابعة.')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center pt-4 pb-6">
          <div className="p-4 bg-yellow-50 rounded-full mb-4">
            <LogIn className="h-8 w-8 text-yellow-500" />
          </div>
          
          <Button 
            className="w-full mb-2 bg-agri hover:bg-agri-dark flex items-center justify-center gap-2" 
            onClick={handleLogin}
          >
            <LogIn className="h-4 w-4" />
            {language === 'en' ? 'Login' : 'تسجيل الدخول'}
          </Button>
          
          <div className="mt-4 text-sm text-center">
            {language === 'en' ? "Don't have an account? " : 'ليس لديك حساب؟ '}
            <Button 
              variant="link" 
              className="text-agri hover:underline p-0 h-auto flex items-center justify-center gap-1 inline-flex" 
              onClick={handleSignup}
            >
              <UserPlus className="h-3 w-3" />
              {language === 'en' ? 'Sign up' : 'إنشاء حساب'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
