import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    shop: 'Boutique',
    about: 'À propos',
    contact: 'Contact',
    cart: 'Panier',
    account: 'Mon compte',
    signIn: 'Connexion',
    signOut: 'Déconnexion',
    
    // Product
    addToCart: 'Ajouter au panier',
    orderWhatsApp: 'Commander par WhatsApp',
    features: 'Caractéristiques',
    colors: 'Couleurs disponibles',
    similarProducts: 'Produits similaires',
    reviews: 'Avis clients',
    writeReview: 'Laisser un avis',
    
    // Cart
    myCart: 'Mon Panier',
    emptyCart: 'Votre panier est vide',
    total: 'Total',
    quantity: 'Quantité',
    remove: 'Supprimer',
    clearCart: 'Vider le panier',
    checkout: 'Passer la commande',
    
    // Checkout
    deliveryMethod: 'Mode de livraison',
    homeDelivery: 'Livraison à domicile',
    storePickup: 'Retrait en boutique',
    paymentMethod: 'Mode de paiement',
    bankCard: 'Carte bancaire',
    cashOnDelivery: 'Paiement à la livraison',
    promoCode: 'Code promo',
    applyPromo: 'Appliquer',
    discount: 'Réduction',
    
    // Account
    myOrders: 'Mes commandes',
    myProfile: 'Mon profil',
    orderHistory: 'Historique des commandes',
    status: 'Statut',
    pending: 'En attente',
    processing: 'En cours',
    delivered: 'Livré',
    
    // Messages
    addedToCart: 'Ajouté au panier',
    orderSuccess: 'Commande validée avec succès !',
    reviewSuccess: 'Avis publié avec succès !',
    promoApplied: 'Code promo appliqué',
    invalidPromo: 'Code promo invalide',
  },
  en: {
    // Navigation
    home: 'Home',
    shop: 'Shop',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    account: 'My Account',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    
    // Product
    addToCart: 'Add to Cart',
    orderWhatsApp: 'Order via WhatsApp',
    features: 'Features',
    colors: 'Available Colors',
    similarProducts: 'Similar Products',
    reviews: 'Customer Reviews',
    writeReview: 'Write a Review',
    
    // Cart
    myCart: 'My Cart',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    quantity: 'Quantity',
    remove: 'Remove',
    clearCart: 'Clear Cart',
    checkout: 'Checkout',
    
    // Checkout
    deliveryMethod: 'Delivery Method',
    homeDelivery: 'Home Delivery',
    storePickup: 'Store Pickup',
    paymentMethod: 'Payment Method',
    bankCard: 'Bank Card',
    cashOnDelivery: 'Cash on Delivery',
    promoCode: 'Promo Code',
    applyPromo: 'Apply',
    discount: 'Discount',
    
    // Account
    myOrders: 'My Orders',
    myProfile: 'My Profile',
    orderHistory: 'Order History',
    status: 'Status',
    pending: 'Pending',
    processing: 'Processing',
    delivered: 'Delivered',
    
    // Messages
    addedToCart: 'Added to cart',
    orderSuccess: 'Order placed successfully!',
    reviewSuccess: 'Review posted successfully!',
    promoApplied: 'Promo code applied',
    invalidPromo: 'Invalid promo code',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('od-shop-language');
    if (saved) return saved as Language;
    
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('fr') ? 'fr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('od-shop-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
