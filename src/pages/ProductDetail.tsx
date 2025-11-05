import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductReviews from "@/components/ProductReviews";
import SocialShare from "@/components/SocialShare";
import RelatedProducts from "@/components/RelatedProducts";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, openCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
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
  const whatsappUrl = `https://wa.me/2250564397919?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart(product);
    setTimeout(() => openCart(), 300);
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: product.price,
          payment_method: 'card',
          payment_status: 'pending',
          delivery_method: 'home',
          customer_phone: '',
          customer_email: user.email || '',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          quantity: 1,
        });

      if (itemsError) throw itemsError;

      const paystackConfig = {
        reference: `OD-${order.id}-${new Date().getTime()}`,
        email: user.email || '',
        amount: product.price * 100,
        publicKey: paystackPublicKey,
        currency: 'XOF',
        metadata: {
          order_id: order.id,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: order.id
            }
          ]
        },
      };

      const onSuccess = async (reference: any) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          await supabase.functions.invoke('verify-paystack-payment', {
            body: {
              reference: reference.reference,
              orderId: order.id,
            },
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          });

          toast({
            title: '🎉 Paiement confirmé !',
            description: 'Votre achat a été effectué avec succès.',
          });
          navigate(`/order-confirmation?order=${order.id}`);
        } catch (error) {
          toast({
            title: 'Erreur',
            description: 'Erreur lors de la vérification du paiement',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      const onClose = () => {
        toast({
          title: '❌ Paiement annulé',
          description: 'Veuillez réessayer ou choisir un autre moyen de paiement.',
          variant: 'destructive',
        });
        setLoading(false);
      };

      const initializePayment = usePaystackPayment(paystackConfig);
      initializePayment({ onSuccess, onClose });
      
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-4 md:py-8">
        <Button variant="ghost" size="sm" asChild className="mb-4 md:mb-6">
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-xs md:text-sm">Retour</span>
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
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
          <div className="space-y-4 md:space-y-6">
            <div>
              <Badge className="mb-2 text-xs">
                {product.category === 'bebe' && 'Bébé'}
                {product.category === 'femmes' && 'Femmes'}
                {product.category === 'garcons' && 'Garçons'}
                {product.category === 'filles' && 'Filles'}
                {product.category === 'hommes' && 'Hommes'}
                {product.category === 'divers' && 'Divers'}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-primary">
                {product.price.toLocaleString()} FCFA
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <h2 className="text-base md:text-lg font-semibold mb-2">Description</h2>
                <p className="text-sm md:text-base text-muted-foreground">{product.description}</p>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h2 className="text-base md:text-lg font-semibold mb-2">Couleurs disponibles</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Badge key={color} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.details && product.details.length > 0 && (
                <div>
                  <h2 className="text-base md:text-lg font-semibold mb-2">Caractéristiques</h2>
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2 md:pt-4">
              <Button 
                className="w-full bg-[#223A70] text-white hover:bg-[#223A70]/90 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all" 
                size="lg"
                onClick={handleBuyNow}
                disabled={loading}
              >
                <CreditCard className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                <span className="text-sm md:text-base">{loading ? 'Chargement...' : 'Acheter maintenant 💳'}</span>
              </Button>
              <div className="flex gap-2 md:gap-3">
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">Panier</span>
                </Button>
                <Button 
                  className="flex-1 bg-[#25D366] text-white hover:bg-[#25D366]/90" 
                  size="lg"
                  asChild
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <span className="text-sm md:text-base">WhatsApp</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Social Share */}
            <div className="pt-4 border-t">
              <SocialShare 
                productName={product.name} 
                productUrl={`/product/${product.id}`} 
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8 md:mt-12">
          <ProductReviews />
        </div>

        {/* Related Products */}
        <RelatedProducts 
          currentProductId={product.id} 
          category={product.category} 
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
