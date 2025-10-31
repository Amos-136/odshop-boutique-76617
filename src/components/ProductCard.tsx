import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, openCart } = useCart();
  const whatsappMessage = `Bonjour, je suis intéressé(e) par le produit: ${product.name} - ${product.price.toLocaleString()} FCFA`;
  const whatsappUrl = `https://wa.me/2250564397919?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart(product);
    setTimeout(() => openCart(), 300);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-elegant">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-3 md:p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm md:text-base text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </Link>
        <p className="mt-2 text-base md:text-lg font-bold text-primary">
          {product.price.toLocaleString()} FCFA
        </p>
      </CardContent>
      <CardFooter className="p-3 md:p-4 pt-0 flex gap-2">
        <Button 
          className="flex-1" 
          size="sm"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          <span className="text-xs md:text-sm">Panier</span>
        </Button>
        <Button 
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" 
          size="sm"
          asChild
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <span className="text-xs md:text-sm">WhatsApp</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
