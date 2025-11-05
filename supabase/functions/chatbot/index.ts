import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get products info for context
    const { data: vendors } = await supabase.from('vendors').select('business_name, business_description').eq('status', 'approved');
    
    const systemPrompt = `Tu es OD Assistant, l'assistant intelligent de OD Shop, une plateforme e-commerce multi-vendeur spécialisée dans la mode et la beauté en Côte d'Ivoire.

**À propos d'OD Shop:**
- Plateforme multi-vendeur avec plusieurs vendeurs indépendants
- Produits: parfums, sacs, accessoires, produits de beauté, produits numériques
- Paiement via Paystack (carte bancaire, mobile money)
- Livraison rapide en Côte d'Ivoire ou retrait en magasin
- Prix en FCFA (Francs CFA)

**Vendeurs actifs:** ${vendors?.map(v => v.business_name).join(', ') || 'Chargement...'}

**Ton rôle:**
1. Aider les clients à trouver des produits selon leurs besoins
2. Répondre aux questions sur les produits, prix, livraison, paiement
3. Suggérer des produits pertinents
4. Être chaleureux, professionnel et concis
5. Parler principalement en français, mais comprendre l'anglais

**Informations importantes:**
- Livraison: 2-5 jours en Côte d'Ivoire
- Paiement: Paystack (carte, mobile money), espèces à la livraison, paiement au retrait
- Retours: Possibles sous 7 jours si produit non ouvert
- Service client: Disponible via WhatsApp au +225 XX XX XX XX XX

Si le client demande un produit spécifique, encourage-le à utiliser la recherche ou à contacter le service client pour plus de détails.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, veuillez réessayer dans un instant." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporairement indisponible, veuillez réessayer plus tard." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Erreur de communication avec le chatbot' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});