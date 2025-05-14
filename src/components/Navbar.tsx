
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-2xl font-bold text-agri">مستشارك الزراعي</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8 rtl:space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-agri font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-agri font-medium">
              {t('nav.services')}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-gray-700 hover:text-agri font-medium">
                  {t('nav.content')}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem>
                  <Link to="/content/articles" className="w-full">
                    {t('content.articles.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/content/videos" className="w-full">
                    {t('content.videos.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/content/animal" className="w-full">
                    {t('content.animal.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/content/case-studies" className="w-full">
                    {t('content.case.title')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/content/ask-us" className="w-full">
                    {t('content.ask.title')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/book" className="text-gray-700 hover:text-agri font-medium">
              {t('nav.book')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-agri font-medium">
              {t('nav.about')}
            </Link>
          </div>

          {/* Auth buttons and language toggle */}
          <div className="hidden md:flex md:items-center md:space-x-4 rtl:space-x-reverse">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/account" className="w-full">
                      {t('nav.account')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">{t('nav.login')}</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="default" className="bg-agri hover:bg-agri-dark">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </>
            )}
            
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className="text-sm font-medium"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className="mr-2 text-sm font-medium"
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
        <div className="md:hidden bg-white py-4 px-4 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-agri font-medium py-2" onClick={toggleMenu}>
              {t('nav.home')}
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-agri font-medium py-2" onClick={toggleMenu}>
              {t('nav.services')}
            </Link>
            <div className="border-t border-gray-200 py-2">
              <div className="text-gray-700 font-medium mb-2">{t('nav.content')}</div>
              <div className="pl-4 rtl:pr-4 rtl:pl-0 space-y-2">
                <Link to="/content/articles" className="block text-gray-600 hover:text-agri" onClick={toggleMenu}>
                  {t('content.articles.title')}
                </Link>
                <Link to="/content/videos" className="block text-gray-600 hover:text-agri" onClick={toggleMenu}>
                  {t('content.videos.title')}
                </Link>
                <Link to="/content/animal" className="block text-gray-600 hover:text-agri" onClick={toggleMenu}>
                  {t('content.animal.title')}
                </Link>
                <Link to="/content/case-studies" className="block text-gray-600 hover:text-agri" onClick={toggleMenu}>
                  {t('content.case.title')}
                </Link>
                <Link to="/content/ask-us" className="block text-gray-600 hover:text-agri" onClick={toggleMenu}>
                  {t('content.ask.title')}
                </Link>
              </div>
            </div>
            <Link to="/book" className="text-gray-700 hover:text-agri font-medium py-2" onClick={toggleMenu}>
              {t('nav.book')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-agri font-medium py-2" onClick={toggleMenu}>
              {t('nav.about')}
            </Link>
            
            <div className="border-t border-gray-200 pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/account" className="block text-gray-700 hover:text-agri font-medium py-2" onClick={toggleMenu}>
                    {t('nav.account')}
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/signup" onClick={toggleMenu}>
                    <Button variant="default" className="w-full bg-agri hover:bg-agri-dark">
                      {t('nav.signup')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
