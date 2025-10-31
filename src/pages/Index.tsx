import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { products } from "@/data/products";
import heroImage from "@/assets/hero-image-optimized.jpg";

const Index = () => {
  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.slice(4, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-light/80" />
        <div className="container relative py-12 md:py-32">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">
                Accessoires tendance & produits de beauté de qualité
              </h1>
              <p className="text-base text-primary-foreground/90 md:text-xl">
                Sublimez votre style au quotidien avec nos collections exclusives ✨
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
                  <Link to="/shop">
                    Découvrir nos produits
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
                  asChild
                >
                  <a href="https://wa.me/2250564397919?text=Bonjour%20OD%20Shop" target="_blank" rel="noopener noreferrer">
                    Commander sur WhatsApp
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
          <img
            src={heroImage}
            alt="OD Shop Collection - Accessoires de mode et produits de beauté premium"
            className="rounded-lg shadow-elegant"
            width="612"
            height="344"
            loading="eager"
          />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 md:py-16 bg-secondary/50">
        <div className="container">
          <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-3">
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="rounded-full bg-primary p-2 md:p-3 flex-shrink-0">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">Qualité Premium</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Produits soigneusement sélectionnés
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="rounded-full bg-primary p-2 md:p-3 flex-shrink-0">
                <Truck className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">Livraison Rapide</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Livraison partout en Côte d'Ivoire
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="rounded-full bg-primary p-2 md:p-3 flex-shrink-0">
                <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">Service Client</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Une équipe à votre écoute
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="py-8 md:py-16">
        <div className="container">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              Nouveautés
            </h2>
            <p className="mt-2 md:mt-4 text-sm md:text-lg text-muted-foreground">
              Découvrez nos dernières collections
            </p>
          </div>
          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 md:mt-12 text-center">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/shop">
                Voir tous les produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-8 md:py-16 bg-secondary/30">
        <div className="container">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              Meilleures Ventes
            </h2>
            <p className="mt-2 md:mt-4 text-sm md:text-lg text-muted-foreground">
              Les produits préférés de nos clients
            </p>
          </div>
          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
