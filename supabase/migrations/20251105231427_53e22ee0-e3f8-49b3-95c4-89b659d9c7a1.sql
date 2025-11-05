-- Supprimer l'ancienne policy restrictive
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;

-- Créer une nouvelle policy qui permet les commandes d'invités ET d'utilisateurs authentifiés
CREATE POLICY "Allow order creation for authenticated users and guests"
ON public.orders
FOR INSERT
WITH CHECK (
  -- Permettre si l'utilisateur est authentifié et que le user_id correspond
  (auth.uid() = user_id)
  OR
  -- Permettre si c'est une commande invité (user_id NULL) avec email et téléphone
  (user_id IS NULL AND customer_email IS NOT NULL AND customer_phone IS NOT NULL)
);

-- Mettre à jour la policy de lecture pour permettre aux invités de voir leurs commandes via email
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

CREATE POLICY "Allow users to view their own orders"
ON public.orders
FOR SELECT
USING (
  -- Utilisateurs authentifiés voient leurs commandes
  (auth.uid() = user_id)
  OR
  -- Les invités peuvent voir leurs commandes (géré par l'application via email)
  (user_id IS NULL)
);

-- Ajouter une policy pour mettre à jour le statut de paiement
CREATE POLICY "Allow payment status updates"
ON public.orders
FOR UPDATE
USING (
  -- Permettre la mise à jour si l'utilisateur est le propriétaire
  (auth.uid() = user_id)
  OR
  -- Permettre la mise à jour pour les commandes invités
  (user_id IS NULL)
);