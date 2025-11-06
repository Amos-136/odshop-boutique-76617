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

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isVendor) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord vendeur</h1>
          <p className="text-muted-foreground mb-3">Bienvenue, {vendorProfile?.business_name || 'Vendeur'}</p>
          <div className="flex gap-2">
            {vendorProfile?.status === 'pending' && (
              <Badge variant="secondary" className="text-sm">⏳ En attente d'approbation</Badge>
            )}
            {vendorProfile?.status === 'approved' && (
              <Badge className="bg-green-500 hover:bg-green-600 text-sm">✓ Approuvé</Badge>
            )}
            {vendorProfile?.status === 'suspended' && (
              <Badge variant="destructive" className="text-sm">⚠ Suspendu</Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Total de produits actifs</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground mt-1">Revenus totaux générés (80%)</p>
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
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Mes Produits</h2>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </div>
            {products.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-12 text-center">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Aucun produit pour le moment</p>
                  <p className="text-sm text-muted-foreground mb-6">Commencez par ajouter votre premier produit à votre boutique</p>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Créer mon premier produit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.price} FCFA</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="hover:bg-primary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="hover:bg-destructive/10">
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
            <h2 className="text-2xl font-bold mb-4">Mes Commandes</h2>
            {orders.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-12 text-center">
                  <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Aucune commande pour le moment</p>
                  <p className="text-sm text-muted-foreground">Vos commandes apparaîtront ici une fois que des clients achèteront vos produits</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((transaction) => (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">Commande #{transaction.orders?.id?.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(transaction.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">{transaction.vendor_amount.toLocaleString()} FCFA</p>
                          <Badge 
                            variant={transaction.status === 'success' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {transaction.status === 'success' ? '✓ Payé' : transaction.status}
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
                <CardDescription>Gérez vos informations de vendeur et votre boutique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="border-l-4 border-l-primary pl-4 py-2">
                    <label className="text-sm font-medium text-muted-foreground">Nom de l'entreprise</label>
                    <p className="text-lg font-semibold text-foreground">{vendorProfile?.business_name || 'Non défini'}</p>
                  </div>
                  <div className="border-l-4 border-l-primary pl-4 py-2">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-foreground">{vendorProfile?.business_description || 'Aucune description fournie'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-l-4 border-l-green-500 pl-4 py-2">
                      <label className="text-sm font-medium text-muted-foreground">Votre commission</label>
                      <p className="text-2xl font-bold text-green-600">80%</p>
                      <p className="text-xs text-muted-foreground">de chaque vente</p>
                    </div>
                    <div className="border-l-4 border-l-blue-500 pl-4 py-2">
                      <label className="text-sm font-medium text-muted-foreground">Commission OD Shop</label>
                      <p className="text-2xl font-bold text-blue-600">{vendorProfile?.commission_rate || 20}%</p>
                      <p className="text-xs text-muted-foreground">Frais plateforme</p>
                    </div>
                  </div>
                  <div className="border-l-4 border-l-primary pl-4 py-2">
                    <label className="text-sm font-medium text-muted-foreground">Statut du compte</label>
                    <div className="mt-1">
                      {vendorProfile?.status === 'approved' && (
                        <Badge className="bg-green-500 text-white">✓ Compte approuvé</Badge>
                      )}
                      {vendorProfile?.status === 'pending' && (
                        <Badge variant="secondary">⏳ En attente d'approbation</Badge>
                      )}
                      {vendorProfile?.status === 'suspended' && (
                        <Badge variant="destructive">⚠ Compte suspendu</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
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