import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Store, CheckCircle } from 'lucide-react';

const BecomeVendor = () => {
  const { user } = useAuth();
  const { isVendor, refreshRole } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    business_logo_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour devenir vendeur",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!formData.business_name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de l'entreprise est requis",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('vendors' as any)
        .insert({
          user_id: user.id,
          business_name: formData.business_name.trim(),
          business_description: formData.business_description.trim(),
          business_logo_url: formData.business_logo_url.trim() || null,
          status: 'pending'
        }) as any;

      if (error) throw error;

      setSubmitted(true);
      await refreshRole();

      toast({
        title: "Demande envoyée !",
        description: "Votre demande de vendeur a été envoyée. Nous l'examinerons bientôt.",
      });

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting vendor application:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer votre demande",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isVendor) {
    navigate('/vendor');
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-12 pb-8 space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Demande envoyée !</h2>
              <p className="text-muted-foreground">
                Votre demande de vendeur a été envoyée avec succès. Notre équipe l'examinera et vous contactera bientôt.
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Devenir Vendeur sur OD Shop</h1>
            <p className="text-muted-foreground">
              Rejoignez notre marketplace et commencez à vendre vos produits
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations de votre entreprise</CardTitle>
              <CardDescription>
                Remplissez ce formulaire pour soumettre votre demande de vendeur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="business_name">Nom de l'entreprise *</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="Ex: Ma Boutique Mode"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="business_description">Description de l'entreprise</Label>
                  <Textarea
                    id="business_description"
                    value={formData.business_description}
                    onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                    placeholder="Décrivez votre entreprise et les produits que vous vendez..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="business_logo_url">URL du logo (optionnel)</Label>
                  <Input
                    id="business_logo_url"
                    type="url"
                    value={formData.business_logo_url}
                    onChange={(e) => setFormData({ ...formData, business_logo_url: e.target.value })}
                    placeholder="https://exemple.com/logo.png"
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold">Avantages vendeur :</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Créez et gérez vos propres produits</li>
                    <li>✓ Recevez 80% du montant de chaque vente</li>
                    <li>✓ Tableau de bord dédié pour suivre vos ventes</li>
                    <li>✓ Support client OD Shop</li>
                    <li>✓ Paiements via Paystack sécurisés</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Soumettre ma demande'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeVendor;