import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderData {
  id: string;
  total_amount: number;
  created_at: string;
  delivery_method: string;
  payment_method: string;
  customer_email?: string;
  customer_phone?: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

const generateInvoiceHTML = (order: OrderData) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product_name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} FCFA</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString()} FCFA</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Facture ${order.id.slice(0, 8)}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .invoice-details { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #223A70; color: white; padding: 12px; text-align: left; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>FACTURE</h1>
        <p>ILHAM BEAUTY SHOP</p>
      </div>
      
      <div class="invoice-details">
        <p><strong>Numéro de facture:</strong> ${order.id.slice(0, 8)}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
        ${order.customer_email ? `<p><strong>Client:</strong> ${order.customer_email}</p>` : ''}
        ${order.customer_phone ? `<p><strong>Téléphone:</strong> ${order.customer_phone}</p>` : ''}
        <p><strong>Mode de paiement:</strong> ${order.payment_method}</p>
        <p><strong>Mode de livraison:</strong> ${order.delivery_method}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Article</th>
            <th style="text-align: center;">Quantité</th>
            <th style="text-align: right;">Prix unitaire</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="total">
        <p>TOTAL: ${order.total_amount.toLocaleString()} FCFA</p>
      </div>

      <div style="margin-top: 60px; text-align: center; color: #666;">
        <p>Merci pour votre confiance !</p>
      </div>
    </body>
    </html>
  `;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { orderId } = await req.json();

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) throw orderError;

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) throw itemsError;

    const orderData: OrderData = {
      ...order,
      items: (items || []).map(item => ({
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.product_price
      })),
    };

    const html = generateInvoiceHTML(orderData);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
