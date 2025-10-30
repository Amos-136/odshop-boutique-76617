export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'accessories' | 'beauty' | 'perfumes' | 'new';
  image: string;
  colors?: string[];
  details?: string[];
}

export const products: Product[] = [
  // Accessories
  {
    id: 'sac-elegance-paris',
    name: 'Sac Élégance Paris',
    price: 18000,
    description: 'Sac à main en cuir synthétique haut de gamme, parfait pour le bureau ou les sorties chics.',
    category: 'accessories',
    image: '/src/assets/products/bags-collection.jpg',
    colors: ['Noir', 'Beige', 'Rouge', 'Blanc'],
    details: ['Livraison rapide partout en Côte d\'Ivoire 🚚', 'Qualité premium', 'Design élégant']
  },
  {
    id: 'montre-classy-gold',
    name: 'Montre Classy Gold',
    price: 15500,
    description: 'Montre dorée unisexe, résistante à l\'eau, avec un design raffiné et moderne.',
    category: 'accessories',
    image: '/src/assets/products/bags-collection.jpg',
    details: ['Garantie : 6 mois', 'Résistante à l\'eau', 'Design unisexe']
  },
  {
    id: 'lunettes-glam',
    name: 'Lunettes Glam',
    price: 9000,
    description: 'Lunettes de soleil tendance pour un look chic et stylé.',
    category: 'accessories',
    image: '/src/assets/products/bags-collection.jpg',
    details: ['UV Protection 400 🌞', 'Style tendance', 'Confort optimal']
  },
  
  // Beauty
  {
    id: 'gloss-crystal-shine',
    name: 'Gloss Crystal Shine',
    price: 4500,
    description: 'Gloss hydratant, brillance intense et tenue longue durée.',
    category: 'beauty',
    image: '/src/assets/products/bags-collection.jpg',
    colors: ['Rose Naturel', 'Nude', 'Corail', 'Berry'],
    details: ['Disponible en 4 teintes naturelles', 'Tenue longue durée', 'Hydratation intense']
  },
  {
    id: 'creme-hydratante-od-skin',
    name: 'Crème Hydratante OD Skin',
    price: 7500,
    description: 'Crème légère enrichie en aloe vera pour une peau douce et éclatante.',
    category: 'beauty',
    image: '/src/assets/products/bags-collection.jpg',
    details: ['Convient à tous types de peau', 'Enrichie en aloe vera', 'Résultats visibles']
  },
  {
    id: 'serum-visage-pure-glow',
    name: 'Sérum Visage Pure Glow',
    price: 10000,
    description: 'Réduit les imperfections et illumine le teint.',
    category: 'beauty',
    image: '/src/assets/products/bags-collection.jpg',
    details: ['Utilisation quotidienne recommandée', 'Illumine le teint', 'Réduit les imperfections']
  },
  {
    id: 'hemani-amla-gold',
    name: 'Hemani Amla Hair Oil Gold',
    price: 6500,
    description: 'Huile d\'amla régale enrichie en vitamine E pour des cheveux sains et brillants.',
    category: 'beauty',
    image: '/src/assets/products/hemani-amla.jpg',
    details: ['200 ml (6.76 fl oz)', 'Enrichie en vitamine E', 'Soin complet des cheveux']
  },
  {
    id: 'marhaba-amla',
    name: 'Marhaba Amla Hair Oil',
    price: 5500,
    description: 'Huile d\'amla avec vitamine E pour revitaliser et nourrir les cheveux.',
    category: 'beauty',
    image: '/src/assets/products/marhaba-amla.jpg',
    details: ['160ml', 'Enrichie en vitamine E', 'Cheveux sains et brillants']
  },
  {
    id: 'marhaba-blackseed',
    name: 'Marhaba Black Seed Shine Hair Oil',
    price: 6000,
    description: 'Huile capillaire à la graine noire pour des cheveux revitalisés et hydratés.',
    category: 'beauty',
    image: '/src/assets/products/marhaba-blackseed.jpg',
    details: ['Revitalise les cheveux', 'Hydratation profonde', 'Brillance intense']
  },
  
  // Perfumes
  {
    id: 'parfum-elegance-femme',
    name: 'Parfum Élégance Femme',
    price: 19000,
    description: 'Notes florales et sucrées, parfaites pour la femme moderne.',
    category: 'perfumes',
    image: '/src/assets/products/paradis-bleu.jpg',
    details: ['Tenue : +10 heures', 'Notes florales', 'Fragrance élégante']
  },
  {
    id: 'paradis-bleu',
    name: 'Paradis Bleu',
    price: 18500,
    description: 'Eau de parfum aux notes aquatiques et fraîches, évoquant le paradis tropical.',
    category: 'perfumes',
    image: '/src/assets/products/paradis-bleu.jpg',
    details: ['Notes aquatiques', 'Fraîcheur durable', 'Flacon élégant']
  },
  {
    id: 'parfum-intense-homme',
    name: 'Parfum Intense Homme',
    price: 20000,
    description: 'Mélange boisé et musqué, symbole de confiance et de charisme.',
    category: 'perfumes',
    image: '/src/assets/products/infidele-homme.jpg',
    details: ['Tenue : +12 heures', 'Notes boisées', 'Masculin et intense']
  },
  {
    id: 'polygame-men',
    name: 'Polygame Eau de Parfum',
    price: 21000,
    description: 'Eau de parfum pour homme, élégant et raffiné avec des notes chaudes.',
    category: 'perfumes',
    image: '/src/assets/products/polygame.jpg',
    details: ['85ml (2.85 fl oz)', 'Notes chaudes', 'Élégant et raffiné']
  },
  {
    id: 'gogo-women',
    name: 'Gogo Eau de Parfum For Women',
    price: 17500,
    description: 'Parfum féminin avec des notes florales délicates et sophistiquées.',
    category: 'perfumes',
    image: '/src/assets/products/gogo-women.jpg',
    details: ['100ml (3.38 fl oz)', 'Notes florales', 'Emballage luxueux']
  },
  {
    id: 'contre-verse',
    name: 'Contre Verse Eau de Parfum Mixte',
    price: 19500,
    description: 'Parfum mixte audacieux avec des notes intenses et captivantes.',
    category: 'perfumes',
    image: '/src/assets/products/contre-verse.jpg',
    details: ['100 ML / 3.38 FL OZ', 'Mixte', 'Notes intenses']
  },
  {
    id: 'deodorant-fresh-day',
    name: 'Déodorant Fresh Day',
    price: 5000,
    description: 'Fraîcheur durable toute la journée 🌿',
    category: 'perfumes',
    image: '/src/assets/products/paradis-bleu.jpg',
    details: ['Format spray', 'Non irritant', 'Fraîcheur 24h']
  },
  
  // New arrivals
  {
    id: 'sac-mini-trend',
    name: 'Sac Mini Trend',
    price: 14000,
    description: 'Petit sac tendance à bandoulière, idéal pour vos sorties.',
    category: 'new',
    image: '/src/assets/products/bags-collection.jpg',
    colors: ['Rose poudré', 'Noir', 'Kaki'],
    details: ['Design tendance', 'Bandoulière ajustable', 'Compact et pratique']
  },
  {
    id: 'parfum-signature-od',
    name: 'Parfum Signature OD',
    price: 22000,
    description: 'Mélange exclusif pour celles et ceux qui aiment se démarquer.',
    category: 'new',
    image: '/src/assets/products/paradis-bleu.jpg',
    details: ['Édition limitée 🌟', 'Fragrance exclusive', 'Flacon collector']
  },
];

export const categories = [
  { id: 'all', name: 'Tous les produits', slug: 'all' },
  { id: 'accessories', name: 'Accessoires', slug: 'accessories' },
  { id: 'beauty', name: 'Beauté', slug: 'beauty' },
  { id: 'perfumes', name: 'Parfums', slug: 'perfumes' },
  { id: 'new', name: 'Nouveautés', slug: 'new' },
];
