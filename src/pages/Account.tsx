import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderTracking from '@/components/OrderTracking';
import ReviewForm from '@/components/ReviewForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronDown, ChevronUp, Download, Star } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  product_price: number;
  order_id: string;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  payment_method: string;
  delivery_method: string;
  delivery_address: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  customer_email?: string;
  customer_phone?: string;
  promo_code: string;
  discount_amount: number;
  items?: OrderItem[];
}

const Account = () => {
  const { user, signOut } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [showReviewForm, setShowReviewForm] = useState<{ orderId: string; productId: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersData) {
        // Fetch items for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: items } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id);
            return { ...order, items: items || [] };
          })
        );
        setOrders(ordersWithItems);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive", label: string }> = {
      pending: { variant: 'secondary', label: 'En attente' },
      confirmed: { variant: 'default', label: 'Confirmée' },
      preparing: { variant: 'default', label: 'En préparation' },
      shipped: { variant: 'default', label: 'Expédiée' },
      delivered: { variant: 'default', label: 'Livrée' }
    };
    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      toast.loading('Génération de la facture...');
      
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { orderId },
      });

      if (error) throw error;

      // Create a blob from the HTML and download it
      const blob = new Blob([data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${orderId.slice(0, 8)}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.dismiss();
      toast.success('Facture téléchargée');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.dismiss();
      toast.error('Erreur lors du téléchargement de la facture');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{t('account')}</h1>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">{t('myOrders')}</TabsTrigger>
              <TabsTrigger value="profile">{t('myProfile')}</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              {loading ? (
                <p>Chargement...</p>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Aucune commande pour le moment
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            Commande #{order.id.slice(0, 8)}
                          </CardTitle>
                          {getStatusBadge(order.status)}
                        </div>
                        <CardDescription>
                          {format(new Date(order.created_at), 'dd MMMM yyyy à HH:mm', {
                            locale: language === 'fr' ? fr : undefined
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-semibold">{order.total_amount.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('paymentMethod')}:</span>
                            <span>{order.payment_method}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('deliveryMethod')}:</span>
                            <span>{order.delivery_method}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(order.id)}
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger la facture
                          </Button>
                        </div>

                        <Separator className="my-4" />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrderExpanded(order.id)}
                          className="w-full"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Masquer les détails
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Voir les détails
                            </>
                          )}
                        </Button>

                        {isExpanded && (
                          <div className="mt-4 animate-fade-in space-y-4">
                            <OrderTracking
                              currentStatus={order.status}
                              createdAt={order.created_at}
                            />

                            {/* Order Items */}
                            {order.items && order.items.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-semibold mb-3">Articles commandés</h4>
                                  <div className="space-y-2">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                                        <div>
                                          <p className="font-medium">{item.product_name}</p>
                                          <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold">{(item.product_price * item.quantity).toLocaleString()} FCFA</p>
                                          {order.status === 'delivered' && (
                                            <Button
                                              variant="link"
                                              size="sm"
                                              onClick={() => setShowReviewForm({ orderId: order.id, productId: item.product_id })}
                                              className="h-auto p-0 text-xs"
                                            >
                                              <Star className="w-3 h-3 mr-1" />
                                              Laisser un avis
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Review Form */}
                            {showReviewForm && showReviewForm.orderId === order.id && (
                              <>
                                <Separator />
                                <ReviewForm
                                  productId={showReviewForm.productId}
                                  orderId={order.id}
                                  onSuccess={() => {
                                    setShowReviewForm(null);
                                    toast.success('Avis publié avec succès !');
                                  }}
                                />
                              </>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{t('myProfile')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{user?.user_metadata?.full_name || 'Non renseigné'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
