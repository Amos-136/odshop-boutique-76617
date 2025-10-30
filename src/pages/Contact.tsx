import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-hero py-16 text-primary-foreground">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Contactez-nous
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Nous sommes là pour vous aider
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Adresse</h3>
                  <p className="text-muted-foreground">
                    Port-Bouët<br />
                    Abidjan, Côte d'Ivoire
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Téléphone</h3>
                  <a 
                    href="tel:+2250564397919" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +225 05 64 39 79 19
                  </a>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Email</h3>
                  <a 
                    href="mailto:sevenci.2024@gmail.com" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    sevenci.2024@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="rounded-lg border bg-gradient-to-br from-[#25D366]/10 to-[#128C7E]/10 p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Commandez sur WhatsApp</h3>
                <p className="mb-6 text-muted-foreground">
                  Le moyen le plus rapide pour commander vos produits et obtenir des réponses à vos questions.
                </p>
                <Button 
                  size="lg" 
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  asChild
                >
                  <a href="https://wa.me/2256439791?text=Bonjour%20OD%20Shop" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Ouvrir WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 rounded-lg bg-muted p-8">
              <h2 className="mb-4 text-2xl font-bold">Horaires d'ouverture</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Lundi - Vendredi :</strong> 9h00 - 18h00</p>
                <p><strong>Samedi :</strong> 10h00 - 16h00</p>
                <p><strong>Dimanche :</strong> Fermé</p>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                * Nous sommes disponibles sur WhatsApp 7j/7 pour répondre à vos questions
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
