import { products, Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  // Get products from the same category, excluding the current product
  const relatedProducts = products
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4 md:mb-6">
        Produits similaires
      </h2>
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
