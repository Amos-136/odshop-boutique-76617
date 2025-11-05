import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data as Review[]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <Card className="mt-6 md:mt-8">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Chargement des avis...</p>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="mt-6 md:mt-8">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Avis clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">
            Aucun avis pour ce produit. Soyez le premier à laisser un avis !
          </p>
        </CardContent>
      </Card>
    );
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

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
          {reviews.map((review) => {
            return (
              <div key={review.id} className="pb-4 border-b last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    😊
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-2 mb-2">
                      <h4 className="font-semibold text-sm md:text-base">Client vérifié</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { 
                          addSuffix: true,
                          locale: fr 
                        })}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-xs md:text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
