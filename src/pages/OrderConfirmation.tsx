import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || 'N/A';

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Merci pour votre commande !
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Votre commande a été enregistrée avec succès
            </p>
          </div>

          {/* Order Number */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Numéro de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl md:text-2xl font-bold text-primary">#{orderNumber}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Un email de confirmation vous a été envoyé avec tous les détails de votre commande.
              </p>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1">1. Préparation de votre commande</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Nous préparons soigneusement vos articles
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1">2. Expédition</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Livraison sous 2-3 jours ouvrés partout en Côte d'Ivoire
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1">3. Réception</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Profitez de vos produits OD Shop !
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-center text-sm md:text-base text-foreground">
                <span className="font-semibold">Merci pour votre confiance ! 💎</span>
                <br />
                <span className="text-muted-foreground">
                  OD Shop est ravi de vous sublimer au quotidien
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button 
              onClick={() => navigate('/account')} 
              className="flex-1"
              size="lg"
            >
              Suivre ma commande
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/shop')} 
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Continuer mes achats
            </Button>
          </div>

          {/* Contact Support */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">
              Une question sur votre commande ?
            </p>
            <Button 
              variant="link" 
              className="text-primary text-xs md:text-sm"
              asChild
            >
              <a 
                href="https://wa.me/2250564397919?text=Bonjour%2C%20j'ai%20une%20question%20sur%20ma%20commande" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Contactez-nous sur WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
