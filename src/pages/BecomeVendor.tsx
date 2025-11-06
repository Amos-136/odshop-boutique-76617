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
          <Card className="max-w-md w-full text-center border-green-200 bg-green-50/50">
            <CardContent className="pt-12 pb-8 space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-green-800">Demande envoyée !</h2>
                <p className="text-muted-foreground text-lg">
                  Votre demande de vendeur a été envoyée avec succès. 
                </p>
                <p className="text-sm text-muted-foreground">
                  Notre équipe l'examinera et vous contactera bientôt par email.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-foreground mb-2">Prochaines étapes :</p>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>✓ Vérification de votre demande</li>
                  <li>✓ Approbation par notre équipe</li>
                  <li>✓ Activation de votre compte vendeur</li>
                </ul>
              </div>
              <Button onClick={() => navigate('/')} className="w-full" size="lg">
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
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Devenir Vendeur sur OD Shop
            </h1>
            <p className="text-muted-foreground text-lg">
              Rejoignez notre marketplace et commencez à vendre vos produits dès aujourd'hui
            </p>
          </div>

          <Card className="shadow-lg border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="text-2xl">Informations de votre entreprise</CardTitle>
              <CardDescription className="text-base">
                Remplissez ce formulaire pour soumettre votre demande de vendeur
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="business_name" className="text-base font-semibold">
                    Nom de l'entreprise <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="Ex: Ma Boutique Mode"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="business_description" className="text-base font-semibold">
                    Description de l'entreprise
                  </Label>
                  <Textarea
                    id="business_description"
                    value={formData.business_description}
                    onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                    placeholder="Décrivez votre entreprise et les produits que vous vendez..."
                    rows={4}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Une bonne description aide les clients à comprendre votre boutique
                  </p>
                </div>

                <div>
                  <Label htmlFor="business_logo_url" className="text-base font-semibold">
                    URL du logo (optionnel)
                  </Label>
                  <Input
                    id="business_logo_url"
                    type="url"
                    value={formData.business_logo_url}
                    onChange={(e) => setFormData({ ...formData, business_logo_url: e.target.value })}
                    placeholder="https://exemple.com/logo.png"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ajoutez le logo de votre entreprise pour personnaliser votre boutique
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-primary/20">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Avantages vendeur
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="text-sm">Créez et gérez vos propres produits facilement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="text-sm">Recevez <strong className="text-green-600">80%</strong> du montant de chaque vente</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="text-sm">Tableau de bord dédié pour suivre vos ventes et revenus</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="text-sm">Support client OD Shop pour vous accompagner</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="text-sm">Paiements sécurisés via Paystack avec versements automatiques</span>
                    </li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Store className="h-4 w-4 mr-2" />
                      Soumettre ma demande
                    </>
                  )}
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