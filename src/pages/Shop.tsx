import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  
  const filteredProducts = categoryParam === 'all' 
    ? products 
    : products.filter(p => p.category === categoryParam);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-hero py-16 text-primary-foreground">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Notre Boutique
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Découvrez toute notre collection de produits
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b bg-background py-6">
          <div className="container">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryParam === category.slug ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Shop;
