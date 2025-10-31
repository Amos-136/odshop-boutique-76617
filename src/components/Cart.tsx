import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, isOpen, closeCart, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

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
