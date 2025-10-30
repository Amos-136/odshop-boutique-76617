import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { products } from "@/data/products";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const featuredProducts = products.filter(p => p.category === 'new').slice(0, 4);
  const bestSellers = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-light/80" />
        <div className="container relative py-24 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Accessoires tendance & produits de beauté de qualité
              </h1>
              <p className="text-lg text-primary-foreground/90 md:text-xl">
                Sublimez votre style au quotidien avec nos collections exclusives ✨
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/shop">
                    Découvrir nos produits
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <a href="https://wa.me/2256439791?text=Bonjour%20OD%20Shop" target="_blank" rel="noopener noreferrer">
                    Commander sur WhatsApp
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="OD Shop Collection"
                className="rounded-lg shadow-elegant"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary p-3">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Qualité Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Produits soigneusement sélectionnés pour leur qualité
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary p-3">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Livraison Rapide</h3>
                <p className="text-sm text-muted-foreground">
                  Livraison rapide partout en Côte d'Ivoire
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary p-3">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Service Client</h3>
                <p className="text-sm text-muted-foreground">
                  Une équipe à votre écoute pour vous conseiller
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Nouveautés
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Découvrez nos dernières collections
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/shop">
                Voir tous les produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Meilleures Ventes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Les produits préférés de nos clients
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
