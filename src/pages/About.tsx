import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Sparkles, Heart, Truck } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-hero py-16 text-primary-foreground">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              À Propos de OD Shop
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90">
              La qualité à votre service
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="prose prose-lg">
              <p className="text-lg text-muted-foreground">
                <strong className="text-foreground">OD Shop</strong> est une boutique ivoirienne spécialisée 
                dans les accessoires de mode et les produits de beauté. Basée à Port-Bouët, Abidjan, nous nous 
                engageons à offrir des produits tendance, élégants et de qualité pour hommes et femmes.
              </p>

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <Sparkles className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Qualité Premium</h3>
                  <p className="text-muted-foreground">
                    Nous sélectionnons avec soin chaque produit pour garantir une qualité exceptionnelle
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <Heart className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Service Client</h3>
                  <p className="text-muted-foreground">
                    Une équipe passionnée, toujours à l'écoute pour vous conseiller et vous satisfaire
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <Truck className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Livraison Rapide</h3>
                  <p className="text-muted-foreground">
                    Livraison rapide et sécurisée partout en Côte d'Ivoire
                  </p>
                </div>
              </div>

              <div className="mt-12 rounded-lg bg-muted p-8">
                <h2 className="mb-4 text-2xl font-bold">Notre Mission</h2>
                <p className="text-muted-foreground">
                  Chez OD Shop, notre mission est de rendre accessible la beauté et l'élégance à tous. 
                  Nous croyons que chaque personne mérite de se sentir belle et confiante, et nous nous 
                  efforçons de proposer des produits qui subliment votre style unique.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="mb-4 text-2xl font-bold">Nos Valeurs</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span><strong>Qualité</strong> : Des produits soigneusement sélectionnés</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span><strong>Confiance</strong> : Transparence et honnêteté dans nos relations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span><strong>Service</strong> : Votre satisfaction est notre priorité</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span><strong>Innovation</strong> : Toujours à l'affût des dernières tendances</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
