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
import { Package, DollarSign, ShoppingBag, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VendorDashboard = () => {
  const { user } = useAuth();
  const { isVendor, vendorProfile, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isVendor) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être vendeur pour accéder à cette page",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isVendor, roleLoading, navigate]);

  useEffect(() => {
    if (vendorProfile?.id) {
      loadDashboardData();
    }
  }, [vendorProfile]);

  const loadDashboardData = async () => {
    if (!vendorProfile?.id) return;
    
    try {
      setLoading(true);

      // Load vendor stats
      setStats({
        totalProducts: 0,
        totalRevenue: vendorProfile.total_revenue || 0,
        totalOrders: vendorProfile.total_orders || 0,
      });

      // Load products
      // Note: Products table needs to be updated after types are regenerated
      setProducts([]);

      // Load orders via transactions - using type assertion until types regenerate
      const { data: transactions } = await supabase
        .from('transactions' as any)
        .select('*, orders(*)')
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false }) as any;

      setOrders(transactions || []);

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

  if (roleLoading || !isVendor) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord vendeur</h1>
          <p className="text-muted-foreground">Bienvenue, {vendorProfile?.business_name}</p>
          {vendorProfile?.status === 'pending' && (
            <Badge variant="secondary" className="mt-2">En attente d'approbation</Badge>
          )}
          {vendorProfile?.status === 'approved' && (
            <Badge className="mt-2 bg-green-500">Approuvé</Badge>
          )}
          {vendorProfile?.status === 'suspended' && (
            <Badge variant="destructive" className="mt-2">Suspendu</Badge>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Total de produits actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground">Revenus totaux générés</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Total de commandes traitées</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes Produits</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </div>
            {products.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Aucun produit pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.price} FCFA</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold">Mes Commandes</h2>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Aucune commande pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Commande #{transaction.orders?.id?.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{transaction.vendor_amount.toLocaleString()} FCFA</p>
                          <Badge variant={transaction.status === 'success' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations du vendeur</CardTitle>
                <CardDescription>Gérez vos informations de vendeur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom de l'entreprise</label>
                  <p className="text-foreground">{vendorProfile?.business_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-foreground">{vendorProfile?.business_description || 'Aucune description'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Taux de commission</label>
                  <p className="text-foreground">{vendorProfile?.commission_rate}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <p className="text-foreground capitalize">{vendorProfile?.status}</p>
                </div>
                <Button variant="outline" className="w-full">Modifier le profil</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default VendorDashboard;