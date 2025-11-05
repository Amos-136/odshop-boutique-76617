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
import { usePaystackPayment } from 'react-paystack';

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
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

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

    if (!email || !phone) {
      toast({
        title: 'Erreur',
        description: 'Veuillez renseigner votre email et numéro de téléphone',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice - discount,
          payment_method: paymentMethod,
          payment_status: (paymentMethod === 'cash' || paymentMethod === 'pickup-pay') ? 'pending' : 'pending',
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'home' ? address : null,
          promo_code: promoCode || null,
          discount_amount: discount,
          customer_phone: phone,
          customer_email: email,
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

      // If payment method is online (card or mobile-money), initiate Paystack payment
      if (paymentMethod === 'card' || paymentMethod === 'mobile-money') {
        const paystackConfig = {
          reference: `OD-${order.id}-${new Date().getTime()}`,
          email: email,
          amount: (totalPrice - discount) * 100, // Paystack expects amount in kobo
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
          channels: paymentMethod === 'card' ? ['card'] : ['mobile_money'],
        };

        const onSuccess = async (reference: any) => {
          console.log('Payment successful:', reference);
          
          try {
            // Verify payment with backend
            const { data: { session } } = await supabase.auth.getSession();
            
            const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
              body: {
                reference: reference.reference,
                orderId: order.id,
              },
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
              },
            });

            if (error) {
              console.error('Verification error:', error);
              toast({
                title: 'Erreur',
                description: 'Erreur lors de la vérification du paiement',
                variant: 'destructive',
              });
              setLoading(false);
              return;
            }

            clearCart();
            toast({
              title: t('orderSuccess'),
              description: 'Paiement confirmé !',
            });
            navigate(`/order-confirmation?order=${order.id}`);
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
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
          console.log('Payment popup closed');
          toast({
            title: 'Paiement annulé',
            description: 'Vous avez annulé le paiement',
            variant: 'destructive',
          });
          setLoading(false);
        };

        // Initialize Paystack payment
        const initializePayment = usePaystackPayment(paystackConfig);
        initializePayment({
          onSuccess,
          onClose,
        });
        
      } else {
        // For cash or pickup payments, just confirm the order
        clearCart();
        toast({
          title: t('orderSuccess'),
          description: 'Nous vous enverrons un email de confirmation.',
        });
        navigate(`/order-confirmation?order=${order.id}`);
        setLoading(false);
      }

    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la commande',
        variant: 'destructive',
      });
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
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse de livraison</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Entrez votre adresse complète"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+225 XX XX XX XX XX"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
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
