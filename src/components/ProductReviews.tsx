import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    author: "Marie S.",
    rating: 5,
    comment: "Produit conforme à la description, je suis ravie de mon achat !",
    date: "Il y a 2 jours",
    avatar: "👩🏾"
  },
  {
    id: 2,
    author: "Kouassi J.",
    rating: 4,
    comment: "Très bon rapport qualité-prix. Livraison rapide.",
    date: "Il y a 1 semaine",
    avatar: "👨🏿"
  },
  {
    id: 3,
    author: "Aya B.",
    rating: 5,
    comment: "Excellent ! Je recommande à 100%. Merci OD Shop !",
    date: "Il y a 2 semaines",
    avatar: "👩🏿"
  }
];

const ProductReviews = () => {
  const averageRating = 4.8;
  const totalReviews = 47;
  
  const ratingDistribution = [
    { stars: 5, count: 38, percentage: 81 },
    { stars: 4, count: 7, percentage: 15 },
    { stars: 3, count: 2, percentage: 4 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  return (
    <Card className="mt-6 md:mt-8">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Avis clients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Overall Rating */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center pb-4 border-b">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold">{averageRating}</div>
            <div className="flex gap-1 my-1 md:my-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 md:h-4 md:w-4 ${
                    i < Math.floor(averageRating) 
                      ? 'fill-primary text-primary' 
                      : 'text-muted-foreground'
                  }`} 
                />
              ))}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">
              {totalReviews} avis
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12 md:w-16">
                  <span className="text-xs md:text-sm">{dist.stars}</span>
                  <Star className="h-3 w-3 fill-primary text-primary" />
                </div>
                <Progress value={dist.percentage} className="flex-1 h-1.5 md:h-2" />
                <span className="text-xs md:text-sm text-muted-foreground w-8 md:w-12 text-right">
                  {dist.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="pb-4 border-b last:border-0">
              <div className="flex items-start gap-3">
                <span className="text-2xl md:text-3xl">{review.avatar}</span>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-2 mb-2">
                    <h4 className="font-semibold text-sm md:text-base">{review.author}</h4>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
