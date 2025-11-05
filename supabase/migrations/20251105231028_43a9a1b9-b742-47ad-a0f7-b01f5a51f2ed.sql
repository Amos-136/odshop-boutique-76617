-- Ajouter les colonnes pour le flux de paiement Paystack
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Créer un index sur payment_reference pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON public.orders(payment_reference);

-- Commentaires pour la documentation
COMMENT ON COLUMN public.orders.customer_email IS 'Email du client (utilisé pour les invités et les confirmations)';
COMMENT ON COLUMN public.orders.customer_phone IS 'Numéro de téléphone du client pour la livraison et WhatsApp';
COMMENT ON COLUMN public.orders.payment_status IS 'Statut du paiement Paystack: pending, completed, failed';
COMMENT ON COLUMN public.orders.payment_reference IS 'Référence de transaction Paystack pour la traçabilité';