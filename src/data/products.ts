// Import all product images
import luxuryBags1 from '@/assets/products/luxury-bags-1.jpg';
import luxuryBags2 from '@/assets/products/luxury-bags-2.jpg';
import luxuryBags3 from '@/assets/products/luxury-bags-3.jpg';
import luxuryBags4 from '@/assets/products/luxury-bags-4.jpg';
import bagsCollection from '@/assets/products/bags-collection.jpg';
import crystalMist from '@/assets/products/crystal-mist.jpg';
import hemaniAmla from '@/assets/products/hemani-amla.jpg';
import marhabaAmla from '@/assets/products/marhaba-amla.jpg';
import marhabaBlackseed from '@/assets/products/marhaba-blackseed.jpg';
import paradisBleu from '@/assets/products/paradis-bleu.jpg';
import infideleHomme from '@/assets/products/infidele-homme.jpg';
import polygame from '@/assets/products/polygame.jpg';
import gogoWomen from '@/assets/products/gogo-women.jpg';
import contreVerse from '@/assets/products/contre-verse.jpg';
import torrideElixir from '@/assets/products/torride-elixir.jpg';
import fideleMalice from '@/assets/products/fidele-malice.jpg';
import saintJeanCoach from '@/assets/products/saint-jean-coach.jpg';

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
    image: luxuryBags1,
    colors: ['Noir', 'Beige', 'Rouge', 'Blanc'],
    details: ['Livraison rapide partout en Côte d\'Ivoire 🚚', 'Qualité premium', 'Design élégant']
  },
  {
    id: 'sac-luxury-collection',
    name: 'Sac Luxury Collection',
    price: 22000,
    description: 'Sacs de luxe en plusieurs coloris, design sophistiqué avec finitions dorées.',
    category: 'accessories',
    image: luxuryBags3,
    colors: ['Blanc', 'Noir', 'Marron', 'Vert'],
    details: ['Finitions dorées', 'Qualité supérieure', 'Plusieurs coloris disponibles']
  },
  {
    id: 'sac-trendy-colors',
    name: 'Sac Trendy Colors',
    price: 19000,
    description: 'Collection de sacs colorés et tendance pour tous les styles.',
    category: 'accessories',
    image: luxuryBags4,
    colors: ['Rose', 'Jaune', 'Blanc', 'Rouge', 'Marron'],
    details: ['Design moderne', 'Bandoulière ajustable', 'Plusieurs coloris']
  },
  {
    id: 'sac-designer-style',
    name: 'Sac Designer Style',
    price: 25000,
    description: 'Sac style designer avec motifs signature et détails luxueux.',
    category: 'accessories',
    image: luxuryBags2,
    colors: ['Noir', 'Beige', 'Marron'],
    details: ['Style designer', 'Qualité exceptionnelle', 'Emballage cadeau inclus']
  },
  {
    id: 'montre-classy-gold',
    name: 'Montre Classy Gold',
    price: 15500,
    description: 'Montre dorée unisexe, résistante à l\'eau, avec un design raffiné et moderne.',
    category: 'accessories',
    image: bagsCollection,
    details: ['Garantie : 6 mois', 'Résistante à l\'eau', 'Design unisexe']
  },
  {
    id: 'lunettes-glam',
    name: 'Lunettes Glam',
    price: 9000,
    description: 'Lunettes de soleil tendance pour un look chic et stylé.',
    category: 'accessories',
    image: bagsCollection,
    details: ['UV Protection 400 🌞', 'Style tendance', 'Confort optimal']
  },
  
  // Beauty
  {
    id: 'gloss-crystal-shine',
    name: 'Gloss Crystal Shine',
    price: 4500,
    description: 'Gloss hydratant, brillance intense et tenue longue durée.',
    category: 'beauty',
    image: bagsCollection,
    colors: ['Rose Naturel', 'Nude', 'Corail', 'Berry'],
    details: ['Disponible en 4 teintes naturelles', 'Tenue longue durée', 'Hydratation intense']
  },
  {
    id: 'crystal-shine-mist',
    name: 'Crystal Shine Mist Spray',
    price: 6500,
    description: 'Spray brillance intense pour cheveux, effet cristal et contrôle des frisottis.',
    category: 'beauty',
    image: crystalMist,
    details: ['Brillance intense', 'Anti-frisottis', 'Format pratique']
  },
  {
    id: 'creme-hydratante-od-skin',
    name: 'Crème Hydratante OD Skin',
    price: 7500,
    description: 'Crème légère enrichie en aloe vera pour une peau douce et éclatante.',
    category: 'beauty',
    image: bagsCollection,
    details: ['Convient à tous types de peau', 'Enrichie en aloe vera', 'Résultats visibles']
  },
  {
    id: 'serum-visage-pure-glow',
    name: 'Sérum Visage Pure Glow',
    price: 10000,
    description: 'Réduit les imperfections et illumine le teint.',
    category: 'beauty',
    image: bagsCollection,
    details: ['Utilisation quotidienne recommandée', 'Illumine le teint', 'Réduit les imperfections']
  },
  {
    id: 'hemani-amla-gold',
    name: 'Hemani Amla Hair Oil Gold',
    price: 6500,
    description: 'Huile d\'amla régale enrichie en vitamine E pour des cheveux sains et brillants.',
    category: 'beauty',
    image: hemaniAmla,
    details: ['200 ml (6.76 fl oz)', 'Enrichie en vitamine E', 'Soin complet des cheveux']
  },
  {
    id: 'marhaba-amla',
    name: 'Marhaba Amla Hair Oil',
    price: 5500,
    description: 'Huile d\'amla avec vitamine E pour revitaliser et nourrir les cheveux.',
    category: 'beauty',
    image: marhabaAmla,
    details: ['160ml', 'Enrichie en vitamine E', 'Cheveux sains et brillants']
  },
  {
    id: 'marhaba-blackseed',
    name: 'Marhaba Black Seed Shine Hair Oil',
    price: 6000,
    description: 'Huile capillaire à la graine noire pour des cheveux revitalisés et hydratés.',
    category: 'beauty',
    image: marhabaBlackseed,
    details: ['Revitalise les cheveux', 'Hydratation profonde', 'Brillance intense']
  },
  
  // Perfumes
  {
    id: 'parfum-elegance-femme',
    name: 'Parfum Élégance Femme',
    price: 19000,
    description: 'Notes florales et sucrées, parfaites pour la femme moderne.',
    category: 'perfumes',
    image: paradisBleu,
    details: ['Tenue : +10 heures', 'Notes florales', 'Fragrance élégante']
  },
  {
    id: 'paradis-bleu',
    name: 'Paradis Bleu',
    price: 18500,
    description: 'Eau de parfum aux notes aquatiques et fraîches, évoquant le paradis tropical.',
    category: 'perfumes',
    image: paradisBleu,
    details: ['Notes aquatiques', 'Fraîcheur durable', 'Flacon élégant']
  },
  {
    id: 'parfum-intense-homme',
    name: 'Parfum Intense Homme',
    price: 20000,
    description: 'Mélange boisé et musqué, symbole de confiance et de charisme.',
    category: 'perfumes',
    image: infideleHomme,
    details: ['Tenue : +12 heures', 'Notes boisées', 'Masculin et intense']
  },
  {
    id: 'polygame-men',
    name: 'Polygame Eau de Parfum',
    price: 21000,
    description: 'Eau de parfum pour homme, élégant et raffiné avec des notes chaudes.',
    category: 'perfumes',
    image: polygame,
    details: ['85ml (2.85 fl oz)', 'Notes chaudes', 'Élégant et raffiné']
  },
  {
    id: 'gogo-women',
    name: 'Gogo Eau de Parfum For Women',
    price: 17500,
    description: 'Parfum féminin avec des notes florales délicates et sophistiquées.',
    category: 'perfumes',
    image: gogoWomen,
    details: ['100ml (3.38 fl oz)', 'Notes florales', 'Emballage luxueux']
  },
  {
    id: 'contre-verse',
    name: 'Contre Verse Eau de Parfum Mixte',
    price: 19500,
    description: 'Parfum mixte audacieux avec des notes intenses et captivantes.',
    category: 'perfumes',
    image: contreVerse,
    details: ['100 ML / 3.38 FL OZ', 'Mixte', 'Notes intenses']
  },
  {
    id: 'torride-eau-de-parfum',
    name: 'Ô Torride Eau de Parfum',
    price: 11000,
    description: 'Parfum captivant disponible pour lui et pour elle, notes sensuelles et élégantes.',
    category: 'perfumes',
    image: torrideElixir,
    details: ['Pour Lui et Pour Elle', 'Notes sensuelles', 'Tenue longue durée']
  },
  {
    id: 'elixir-collection',
    name: 'Elixir Collection Eau de Parfum',
    price: 9000,
    description: 'Le parfum irrésistible pour femme, notes florales et fruitées captivantes.',
    category: 'perfumes',
    image: torrideElixir,
    details: ['Collection exclusive', 'Notes florales et fruitées', 'Irresistible']
  },
  {
    id: 'fidele-eau-de-parfum',
    name: 'Fidèle Eau de Parfum',
    price: 18000,
    description: 'Parfum féminin délicat et raffiné, notes florales romantiques.',
    category: 'perfumes',
    image: fideleMalice,
    details: ['Notes florales', 'Romantique et délicat', 'Tenue : +10 heures']
  },
  {
    id: 'malice-eau-de-parfum',
    name: 'Malice Eau de Parfum',
    price: 7000,
    description: 'Parfum pétillant et enjoué, parfait pour la femme moderne.',
    category: 'perfumes',
    image: fideleMalice,
    details: ['Notes pétillantes', 'Fraîcheur durable', 'Style moderne']
  },
  {
    id: 'saint-jean-parfum',
    name: 'Saint-Jean Eau de Parfum',
    price: 11000,
    description: 'Parfum masculin intense et élégant aux notes profondes.',
    category: 'perfumes',
    image: saintJeanCoach,
    details: ['Masculin intense', 'Notes profondes', 'Tenue exceptionnelle']
  },
  {
    id: 'coach-collection',
    name: 'Coach Eau de Parfum Collection',
    price: 13000,
    description: 'Collection de parfums Coach pour homme et femme, élégance et raffinement.',
    category: 'perfumes',
    image: saintJeanCoach,
    details: ['Pour Homme et Femme', 'Notes élégantes', 'Collection signature']
  },
  {
    id: 'deodorant-fresh-day',
    name: 'Déodorant Fresh Day',
    price: 5000,
    description: 'Fraîcheur durable toute la journée 🌿',
    category: 'perfumes',
    image: paradisBleu,
    details: ['Format spray', 'Non irritant', 'Fraîcheur 24h']
  },
  
  // New arrivals
  {
    id: 'sac-mini-trend',
    name: 'Sac Mini Trend',
    price: 14000,
    description: 'Petit sac tendance à bandoulière, idéal pour vos sorties.',
    category: 'new',
    image: luxuryBags2,
    colors: ['Rose poudré', 'Noir', 'Kaki'],
    details: ['Design tendance', 'Bandoulière ajustable', 'Compact et pratique']
  },
  {
    id: 'parfum-signature-od',
    name: 'Parfum Signature OD',
    price: 22000,
    description: 'Mélange exclusif pour celles et ceux qui aiment se démarquer.',
    category: 'new',
    image: paradisBleu,
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
