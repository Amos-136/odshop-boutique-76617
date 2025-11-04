import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Aminata K.",
    location: "Abidjan",
    rating: 5,
    comment: "Excellent service ! Les produits sont de très bonne qualité et la livraison était rapide. Je recommande vivement OD Shop !",
    avatar: "👩🏾"
  },
  {
    id: 2,
    name: "Yao M.",
    location: "Cocody",
    rating: 5,
    comment: "J'ai adoré mon sac Élégance Paris. La qualité est top et le prix très abordable. Merci OD Shop !",
    avatar: "👨🏿"
  },
  {
    id: 3,
    name: "Fatoumata D.",
    location: "Plateau",
    rating: 5,
    comment: "Service client au top ! Ils ont répondu rapidement à toutes mes questions sur WhatsApp. Parfait !",
    avatar: "👩🏿"
  }
];

const Testimonials = () => {
  return (
    <section className="py-8 md:py-16 bg-secondary/30">
      <div className="container">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Ce que disent nos clients
          </h2>
          <p className="mt-2 md:mt-4 text-sm md:text-lg text-muted-foreground">
            Des milliers de clients satisfaits nous font confiance
          </p>
        </div>
        
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-primary/10">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <span className="text-3xl md:text-4xl">{testimonial.avatar}</span>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{testimonial.name}</h3>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-2 md:mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <p className="text-xs md:text-sm text-muted-foreground italic">
                  "{testimonial.comment}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
