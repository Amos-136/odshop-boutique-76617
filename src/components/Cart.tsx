import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { usePaystackPayment } from 'react-paystack';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, isOpen, closeCart, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return "";
    
    let message = "Bonjour OD Shop 👋\n\nJe souhaite commander :\n\n";
    
    items.forEach((item) => {
      message += `• ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} FCFA\n`;
    });
    
    message += `\n💰 Total : ${totalPrice.toLocaleString()} FCFA`;
    
    return message;
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/2250564397919?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      closeCart();
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  const handlePayNow = async () => {
    if (!user) {
      navigate('/auth');
      closeCart();
      return;
    }

    if (items.length === 0) return;

    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          payment_method: 'card',
          payment_status: 'pending',
          delivery_method: 'home',
          customer_phone: '',
          customer_email: user.email || '',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const paystackConfig = {
        reference: `OD-${order.id}-${new Date().getTime()}`,
        email: user.email || '',
        amount: totalPrice * 100,
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

          clearCart();
          closeCart();
          toast({
            title: '🎉 Paiement confirmé !',
            description: 'Votre commande a été effectuée avec succès.',
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
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t('myCart')} ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">{t('emptyCart')}</p>
              <p className="text-sm text-muted-foreground">
                Ajoutez des produits pour commencer vos achats
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card animate-fade-in"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-sm text-primary font-bold mt-1">
                      {item.price.toLocaleString()} FCFA
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator className="my-4" />
            <SheetFooter className="flex-col gap-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>{t('total')}</span>
                <span className="text-primary">{totalPrice.toLocaleString()} FCFA</span>
              </div>
              <Button
                className="w-full bg-[#223A70] text-white hover:bg-[#223A70]/90 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                size="lg"
                onClick={handlePayNow}
                disabled={loading}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {loading ? 'Chargement...' : 'Procéder au paiement 💰'}
              </Button>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
              >
                {t('checkout')}
              </Button>
              <Button
                variant="outline"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                onClick={handleWhatsAppOrder}
              >
                {t('orderWhatsApp')}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                {t('clearCart')}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
