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

  if (roleLoading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord Administrateur</h1>
          <p className="text-muted-foreground">Gérez votre plateforme OD Shop</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendeurs</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingVendors} en attente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Total de commandes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground">Revenus totaux</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.totalRevenue * 0.2).toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground">Commission plateforme (20%)</p>
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
            <h2 className="text-2xl font-bold">Gestion des Vendeurs</h2>
            {vendors.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Aucun vendeur pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {vendors.map((vendor) => (
                  <Card key={vendor.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{vendor.business_name}</h3>
                          <p className="text-sm text-muted-foreground">{vendor.business_description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={
                              vendor.status === 'approved' ? 'default' : 
                              vendor.status === 'pending' ? 'secondary' : 
                              'destructive'
                            }>
                              {vendor.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Commission: {vendor.commission_rate}%
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {vendor.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateVendorStatus(vendor.id, 'approved')}
                                className="gap-2"
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
                            >
                              Suspendre
                            </Button>
                          )}
                          {vendor.status === 'suspended' && (
                            <Button
                              size="sm"
                              onClick={() => updateVendorStatus(vendor.id, 'approved')}
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
            <h2 className="text-2xl font-bold">Commandes Récentes</h2>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Aucune commande pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Commande #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer_email || 'Client invité'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{Number(order.total_amount).toLocaleString()} FCFA</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
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