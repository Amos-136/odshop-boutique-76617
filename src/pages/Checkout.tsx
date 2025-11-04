import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [deliveryMethod, setDeliveryMethod] = useState('home');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const applyPromoCode = async () => {
    if (!promoCode) return;

    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (data) {
      const discountAmount = (totalPrice * data.discount_percentage) / 100;
      setDiscount(discountAmount);
      toast({
        title: t('promoApplied'),
        description: `${data.discount_percentage}% de réduction`,
      });
    } else {
      toast({
        title: t('invalidPromo'),
        variant: 'destructive',
      });
    }
  };

  const handleOrder = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (deliveryMethod === 'home' && !address) {
      toast({
        title: 'Erreur',
        description: 'Veuillez renseigner votre adresse de livraison',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice - discount,
          payment_method: paymentMethod,
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'home' ? address : null,
          promo_code: promoCode || null,
          discount_amount: discount,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
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

      clearCart();
      toast({
        title: t('orderSuccess'),
        description: 'Nous vous enverrons un email de confirmation.',
      });
      navigate(`/order-confirmation?order=${order.id}`);
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la commande',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t('emptyCart')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">{t('checkout')}</h1>

          <Card>
            <CardHeader>
              <CardTitle>{t('deliveryMethod')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home">{t('homeDelivery')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">{t('storePickup')} (Gratuit)</Label>
                </div>
              </RadioGroup>

              {deliveryMethod === 'home' && (
                <div className="mt-4">
                  <Label htmlFor="address">Adresse de livraison</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Entrez votre adresse complète"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('paymentMethod')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Carte bancaire (Visa / Mastercard)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile-money" id="mobile-money" />
                  <Label htmlFor="mobile-money">Mobile Money (Orange, MTN, Moov, Wave)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Paiement à la livraison (Cash)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup-pay" id="pickup-pay" />
                  <Label htmlFor="pickup-pay">Paiement en boutique (Click & Collect)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('promoCode')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrez votre code"
                />
                <Button onClick={applyPromoCode} variant="outline">
                  {t('applyPromo')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{totalPrice.toLocaleString()} FCFA</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t('discount')}:</span>
                  <span>-{discount.toLocaleString()} FCFA</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>{t('total')}:</span>
                <span>{(totalPrice - discount).toLocaleString()} FCFA</span>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleOrder}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Traitement...' : 'Confirmer la commande'}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
