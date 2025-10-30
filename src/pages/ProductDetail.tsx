import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, openCart } = useCart();
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Produit non trouvé</h1>
            <p className="text-muted-foreground mb-8">
              Désolé, ce produit n'existe pas ou n'est plus disponible.
            </p>
            <Button asChild>
              <Link to="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la boutique
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = `Bonjour, je suis intéressé(e) par le produit: ${product.name} - ${product.price.toLocaleString()} FCFA`;
  const whatsappUrl = `https://wa.me/22564397919?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart(product);
    setTimeout(() => openCart(), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la boutique
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image du produit */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Détails du produit */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">
                {product.category === 'accessories' && 'Accessoires'}
                {product.category === 'beauty' && 'Beauté'}
                {product.category === 'perfumes' && 'Parfums'}
                {product.category === 'new' && 'Nouveauté'}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-primary">
                {product.price.toLocaleString()} FCFA
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Couleurs disponibles</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Badge key={color} variant="outline">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.details && product.details.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Caractéristiques</h2>
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                size="lg"
                asChild
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Commander via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
