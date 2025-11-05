import { Link } from "react-router-dom";
import { ShoppingCart, Menu, User, LogOut, Globe, Search, ChevronDown, Store, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo-optimized.jpg";
import bebeImg from "@/assets/categories/bebe.jpg";
import femmesImg from "@/assets/categories/femmes.jpg";
import garconsImg from "@/assets/categories/garcons.jpg";
import fillesImg from "@/assets/categories/filles.jpg";
import hommesImg from "@/assets/categories/hommes.jpg";
import diversImg from "@/assets/categories/divers.jpg";
import { useState } from "react";

const Navbar = () => {
  const { totalItems, openCart } = useCart();
  const { user, signOut } = useAuth();
  const { isAdmin, isVendor } = useRole();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const navigation = [
    { name: t('home'), href: "/" },
    { name: t('shop'), href: "/shop" },
    { name: t('about'), href: "/about" },
    { name: t('contact'), href: "/contact" },
  ];

  const categories = [
    { id: 'bebe', name: 'Bébé', slug: 'bebe', image: bebeImg },
    { id: 'femmes', name: 'Femmes', slug: 'femmes', image: femmesImg },
    { id: 'garcons', name: 'Garçons', slug: 'garcons', image: garconsImg },
    { id: 'filles', name: 'Filles', slug: 'filles', image: fillesImg },
    { id: 'hommes', name: 'Hommes', slug: 'hommes', image: hommesImg },
    { id: 'divers', name: 'Divers', slug: 'divers', image: diversImg },
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
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {isVendor && (
                  <DropdownMenuItem asChild>
                    <Link to="/vendor">
                      <Store className="mr-2 h-4 w-4" />
                      Espace Vendeur
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
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

          {/* Mobile Cart Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden relative"
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
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <div className="flex flex-col space-y-6 mt-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Recherche..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/50"
                  />
                </div>

                {/* Accueil Link */}
                <Link
                  to="/"
                  className="text-center text-base font-medium text-foreground py-2"
                >
                  Accueil
                </Link>

                {/* Categories Collapsible */}
                <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-center py-2">
                    <span className="text-base font-medium text-muted-foreground mx-auto flex items-center gap-2">
                      Catégories d'articles
                      <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-4">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/shop?category=${category.slug}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-lg font-semibold text-primary">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Other Navigation Links */}
                {navigation.slice(1).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-base font-medium text-foreground py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <Link to="/account" className="text-base font-medium py-2">
                      {t('account')}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="text-base font-medium py-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    {isVendor && (
                      <Link to="/vendor" className="text-base font-medium py-2 flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Espace Vendeur
                      </Link>
                    )}
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
