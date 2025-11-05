import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderTracking from '@/components/OrderTracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  payment_method: string;
  delivery_method: string;
  created_at: string;
}

const Account = () => {
  const { user, signOut } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
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
                              Masquer le suivi
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Voir le suivi de commande
                            </>
                          )}
                        </Button>

                        {isExpanded && (
                          <div className="mt-4 animate-fade-in">
                            <OrderTracking
                              currentStatus={order.status}
                              createdAt={order.created_at}
                            />
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
