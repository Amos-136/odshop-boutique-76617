import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Store, ShoppingBag, DollarSign, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [vendors, setVendors] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être administrateur pour accéder à cette page",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load vendors - using type assertion until types regenerate
      const { data: vendorsData } = await supabase
        .from('vendors' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any;

      setVendors(vendorsData || []);

      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setOrders(ordersData || []);

      // Calculate stats
      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const pendingVendors = vendorsData?.filter(v => v.status === 'pending').length || 0;

      setStats({
        totalVendors: vendorsData?.length || 0,
        pendingVendors,
        totalOrders,
        totalRevenue,
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVendorStatus = async (vendorId: string, status: 'approved' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('vendors' as any)
        .update({ status })
        .eq('id', vendorId) as any;

      if (error) throw error;

      // If approving, add vendor role
      if (status === 'approved') {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor) {
          await supabase
            .from('user_roles' as any)
            .upsert({ user_id: vendor.user_id, role: 'vendor' }) as any;
        }
      }

      toast({
        title: "Succès",
        description: `Vendeur ${status === 'approved' ? 'approuvé' : 'suspendu'} avec succès`,
      });

      loadDashboardData();
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le vendeur",
        variant: "destructive"
      });
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
          <h1 className="text-3xl font-bold text-foreground mb-2">🛡️ Tableau de bord Administrateur</h1>
          <p className="text-muted-foreground">Gérez votre plateforme multi-vendeur OD Shop</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendeurs</CardTitle>
              <Store className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalVendors}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingVendors > 0 ? `${stats.pendingVendors} en attente d'approbation` : 'Tous approuvés'}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingBag className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Total de commandes traitées</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground mt-1">Revenus générés sur la plateforme</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission OD Shop</CardTitle>
              <DollarSign className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{(stats.totalRevenue * 0.2).toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground mt-1">Votre part (20% des ventes)</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="vendors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vendors">Vendeurs</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Gestion des Vendeurs</h2>
            {vendors.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-12 text-center">
                  <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Aucun vendeur pour le moment</p>
                  <p className="text-sm text-muted-foreground">Les demandes de vendeurs apparaîtront ici</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Store className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-xl mb-1">{vendor.business_name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {vendor.business_description || 'Aucune description'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-center flex-wrap">
                            <Badge 
                              variant={
                                vendor.status === 'approved' ? 'default' : 
                                vendor.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }
                              className="text-sm"
                            >
                              {vendor.status === 'approved' && '✓ Approuvé'}
                              {vendor.status === 'pending' && '⏳ En attente'}
                              {vendor.status === 'suspended' && '⚠ Suspendu'}
                            </Badge>
                            <span className="text-sm font-medium text-muted-foreground">
                              Commission: <span className="text-foreground">{vendor.commission_rate}% OD Shop</span>
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Inscrit le {new Date(vendor.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-col sm:flex-row">
                          {vendor.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateVendorStatus(vendor.id, 'approved')}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                                Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateVendorStatus(vendor.id, 'suspended')}
                                className="gap-2"
                              >
                                <X className="h-4 w-4" />
                                Refuser
                              </Button>
                            </>
                          )}
                          {vendor.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateVendorStatus(vendor.id, 'suspended')}
                              className="hover:bg-destructive/10"
                            >
                              Suspendre
                            </Button>
                          )}
                          {vendor.status === 'suspended' && (
                            <Button
                              size="sm"
                              onClick={() => updateVendorStatus(vendor.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Réactiver
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Commandes Récentes</h2>
            {orders.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-12 text-center">
                  <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Aucune commande pour le moment</p>
                  <p className="text-sm text-muted-foreground">Les commandes apparaîtront ici dès qu'un client effectuera un achat</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-lg mb-2">Commande #{order.id.slice(0, 8)}</p>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              📧 {order.customer_email || 'Client invité'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              📞 {order.customer_phone || 'Non renseigné'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              📅 {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-green-600 mb-2">
                            {Number(order.total_amount).toLocaleString()} FCFA
                          </p>
                          <Badge 
                            variant={order.status === 'completed' ? 'default' : 'secondary'}
                            className="text-sm"
                          >
                            {order.status === 'completed' ? '✓ Complétée' : order.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2">
                            Commission: {(Number(order.total_amount) * 0.2).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;