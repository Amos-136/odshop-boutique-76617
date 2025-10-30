import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="OD Shop" className="h-12 w-auto" />
            <p className="text-sm text-muted-foreground">
              Accessoires tendance & produits de beauté de qualité pour sublimer votre style au quotidien
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Liens Rapides</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/shop" className="transition-colors hover:text-primary">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-primary">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Catégories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/shop?category=accessories" className="transition-colors hover:text-primary">
                  Accessoires
                </Link>
              </li>
              <li>
                <Link to="/shop?category=beauty" className="transition-colors hover:text-primary">
                  Beauté
                </Link>
              </li>
              <li>
                <Link to="/shop?category=perfumes" className="transition-colors hover:text-primary">
                  Parfums
                </Link>
              </li>
              <li>
                <Link to="/shop?category=new" className="transition-colors hover:text-primary">
                  Nouveautés
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Port-Bouët, Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+2250564397919" className="transition-colors hover:text-primary">
                  +225 05 64 39 79 19
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:sevenci.2024@gmail.com" className="transition-colors hover:text-primary">
                  sevenci.2024@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OD Shop. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
