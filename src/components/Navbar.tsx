import { Link } from "react-router-dom";
import { ShoppingCart, Menu, User, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo-optimized.jpg";

const Navbar = () => {
  const { totalItems, openCart } = useCart();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { name: t('home'), href: "/" },
    { name: t('shop'), href: "/shop" },
    { name: t('about'), href: "/about" },
    { name: t('contact'), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="OD Shop - Boutique de mode et beauté" className="h-12 w-auto" width="78" height="48" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('fr')}>
                🇫🇷 Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/account">{t('account')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link to="/auth">{t('signIn')}</Link>
            </Button>
          )}

          {/* Cart Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex relative"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <Link to="/account" className="text-lg font-medium">
                      {t('account')}
                    </Link>
                    <Button variant="outline" onClick={signOut} className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('signOut')}
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/auth">{t('signIn')}</Link>
                  </Button>
                )}
                
                <Button className="w-full relative" onClick={openCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t('cart')}
                  {totalItems > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {totalItems}
                    </Badge>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setLanguage('fr')}
                    className="flex-1"
                  >
                    🇫🇷 FR
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setLanguage('en')}
                    className="flex-1"
                  >
                    🇬🇧 EN
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
