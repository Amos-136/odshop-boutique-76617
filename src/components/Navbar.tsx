import { Link } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo.jpg";

const Navbar = () => {
  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Boutique", href: "/shop" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="OD Shop" className="h-12 w-auto" />
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

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <ShoppingCart className="h-5 w-5" />
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
