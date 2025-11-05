import { Link } from "react-router-dom";
import { ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, openCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  const whatsappMessage = `Bonjour, je suis intéressé(e) par le produit: ${product.name} - ${product.price.toLocaleString()} FCFA`;
  const whatsappUrl = `https://wa.me/2250564397919?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart(product);
    setTimeout(() => openCart(), 300);
  };

  const handleBuyNow = async () => {
    if (!user) {
      setShowEmailDialog(true);
      return;
    }
    await processPayment(user.email || '', '');
  };

  const handleGuestPayment = async () => {
    if (!guestEmail || !guestPhone) {
      toast({
        title: 'Erreur',
        description: 'Veuillez renseigner votre email et téléphone',
        variant: 'destructive',
      });
      return;
    }
    setShowEmailDialog(false);
    await processPayment(guestEmail, guestPhone);
  };

  const processPayment = async (email: string, phone: string) => {
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          total_amount: product.price,
          payment_method: 'card',
          payment_status: 'pending',
          delivery_method: 'home',
          customer_phone: phone,
          customer_email: email,
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
        email: email,
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
            headers: session?.access_token ? {
              Authorization: `Bearer ${session.access_token}`,
            } : {},
          });

          toast({
            title: '🎉 Paiement confirmé !',
            description: 'Votre achat a été effectué avec succès.',
          });
          navigate(`/order-confirmation?order=${order.id}`);
        } catch (error) {
          console.error('Verification error:', error);
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
      console.error('Order error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <>
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
        <CardFooter className="p-3 md:p-4 pt-0 flex flex-col gap-2">
          <Button 
            className="w-full bg-[#223A70] text-white hover:bg-[#223A70]/90 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all" 
            size="sm"
            onClick={handleBuyNow}
            disabled={loading}
          >
            <CreditCard className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm">{loading ? 'Chargement...' : 'Acheter maintenant 💳'}</span>
          </Button>
          <div className="flex gap-2 w-full">
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
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informations de contact</DialogTitle>
            <DialogDescription>
              Veuillez fournir votre email et téléphone pour procéder au paiement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="guest-email">Email</Label>
              <Input
                id="guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-phone">Téléphone</Label>
              <Input
                id="guest-phone"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+225 XX XX XX XX XX"
              />
            </div>
          </div>
          <Button onClick={handleGuestPayment} className="w-full">
            Continuer vers le paiement
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
