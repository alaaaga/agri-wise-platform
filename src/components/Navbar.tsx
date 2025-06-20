
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  UserPlus, 
  LogIn, 
  Moon, 
  Sun, 
  LayoutDashboard,
  ShoppingCart,
  Store,
  Package
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout, getUserDisplayName, checkAdminRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getCartCount();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(language === 'en' ? 'Successfully logged out' : 'تم تسجيل الخروج بنجاح');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(language === 'en' ? 'Failed to log out. Please try again.' : 'فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.');
    }
  };

  // إعادة التحقق من حالة المسؤول عند تغيير المستخدم
  useEffect(() => {
    if (isAuthenticated && user) {
      checkAdminRole();
    }
  }, [isAuthenticated, user, checkAdminRole]);

  // إغلاق القائمة المتنقلة عند تغيير المسار
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-2xl font-bold text-primary dark:text-primary">مستشارك الزراعي</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 rtl:space-x-reverse">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium px-2">
              {t('nav.home')}
            </Link>
            <Link to="/services" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium px-2">
              {t('nav.services')}
            </Link>
            
            {/* Marketplace Link */}
            <Link to="/marketplace" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium px-2 flex items-center gap-1">
              <Store className="h-4 w-4" />
              {language === 'en' ? 'Marketplace' : 'المتجر'}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary font-medium px-2">
                  {t('nav.content')}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-900">
                <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                  <Link to="/content/articles" className="w-full">
                    {t('content.articles.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                  <Link to="/content/videos" className="w-full">
                    {t('content.videos.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                  <Link to="/content/animal" className="w-full">
                    {t('content.animal.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                  <Link to="/content/case-studies" className="w-full">
                    {t('content.case.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                  <Link to="/content/ask-us" className="w-full">
                    {t('content.ask.title')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/book" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium px-2">
              {t('nav.book')}
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium px-2">
              {t('nav.about')}
            </Link>
          </div>

          {/* Auth buttons, cart, theme toggle and language toggle */}
          <div className="hidden md:flex md:items-center md:space-x-4 rtl:space-x-reverse">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 text-gray-700 dark:text-gray-200 hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <Button 
              variant="ghost" 
              onClick={toggleTheme}
              className="text-sm font-medium"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className="text-sm font-medium"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse dark:border-gray-700 dark:text-gray-200">
                    <User className="h-4 w-4" />
                    <span>{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-gray-900">
                  {isAdmin && (
                    <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                      <Link to="/admin" className="w-full flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        <span>{language === 'en' ? 'Admin Dashboard' : 'لوحة التحكم'}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                    <Link to="/account" className="w-full">
                      {t('nav.account')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                    <Link to="/orders" className="w-full flex items-center">
                      <Package className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{language === 'en' ? 'My Orders' : 'طلباتي'}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center dark:text-gray-200 dark:focus:text-white">
                    <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <span>{language === 'en' ? 'Logout' : 'تسجيل الخروج'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse dark:border-gray-700 dark:text-gray-200">
                    <UserPlus className="h-4 w-4" />
                    <span>{language === 'en' ? 'Account' : 'الحساب'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-gray-900">
                  <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                    <Link to="/login" className="w-full flex items-center">
                      <LogIn className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{t('nav.login')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-200 dark:focus:text-white">
                    <Link to="/signup" className="w-full flex items-center">
                      <UserPlus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{t('nav.signup')}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4 rtl:space-x-reverse">
            {/* Mobile Cart Icon */}
            {isAuthenticated && (
              <Link to="/cart" className="relative p-1 text-gray-700 dark:text-gray-200">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <Button 
              variant="ghost" 
              onClick={toggleTheme}
              className="p-1"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className="text-sm font-medium"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            
            <Button variant="ghost" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 px-4 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium py-2">
              {t('nav.home')}
            </Link>
            <Link to="/services" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium py-2">
              {t('nav.services')}
            </Link>
            
            {/* Mobile Marketplace Link */}
            <Link to="/marketplace" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium py-2 flex items-center gap-2">
              <Store className="h-4 w-4" />
              {language === 'en' ? 'Marketplace' : 'المتجر'}
            </Link>
            
            <div className="border-t border-gray-200 dark:border-gray-700 py-2">
              <div className="text-gray-700 dark:text-gray-200 font-medium mb-2">{t('nav.content')}</div>
              <div className="pl-4 rtl:pr-4 rtl:pl-0 space-y-2">
                <Link to="/content/articles" className="block text-gray-600 dark:text-gray-400 hover:text-primary">
                  {t('content.articles.title')}
                </Link>
                <Link to="/content/videos" className="block text-gray-600 dark:text-gray-400 hover:text-primary">
                  {t('content.videos.title')}
                </Link>
                <Link to="/content/animal" className="block text-gray-600 dark:text-gray-400 hover:text-primary">
                  {t('content.animal.title')}
                </Link>
                <Link to="/content/case-studies" className="block text-gray-600 dark:text-gray-400 hover:text-primary">
                  {t('content.case.title')}
                </Link>
                <Link to="/content/ask-us" className="block text-gray-600 dark:text-gray-400 hover:text-primary">
                  {t('content.ask.title')}
                </Link>
              </div>
            </div>
            <Link to="/book" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium py-2">
              {t('nav.book')}
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium py-2">
              {t('nav.about')}
            </Link>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary font-medium py-2">
                      <LayoutDashboard className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{language === 'en' ? 'Admin Dashboard' : 'لوحة التحكم'}</span>
                    </Link>
                  )}
                  <Link to="/account" className="block text-gray-700 dark:text-gray-200 hover:text-primary font-medium py-2">
                    {t('nav.account')}
                  </Link>
                  <Link to="/orders" className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary font-medium py-2">
                    <Package className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <span>{language === 'en' ? 'My Orders' : 'طلباتي'}</span>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full justify-start dark:border-gray-700 dark:text-gray-200"
                  >
                    <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <span>{language === 'en' ? 'Logout' : 'تسجيل الخروج'}</span>
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={toggleMenu}>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start dark:border-gray-700 dark:text-gray-200"
                    >
                      <LogIn className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{t('nav.login')}</span>
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={toggleMenu}>
                    <Button 
                      variant="default" 
                      className="w-full justify-start bg-primary hover:bg-primary-dark"
                    >
                      <UserPlus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span>{t('nav.signup')}</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
