-- =====================================================
-- Fix Order Tracking & Payment RLS Policies
-- Allows viewing orders, items, and submitting payments by order ID
-- without requiring authentication or matching user_id.
-- =====================================================

-- 1. Allow public select on orders by order ID for tracking
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Public view orders by ID" ON public.orders
  FOR SELECT TO anon, authenticated
  USING (true);

-- 2. Allow public select on order_items by order ID
DROP POLICY IF EXISTS "Users view own order_items" ON public.order_items;
CREATE POLICY "Public view order_items" ON public.order_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- 3. Allow public select on order_payments
DROP POLICY IF EXISTS "Users view own order payments" ON public.order_payments;
CREATE POLICY "Public view order_payments" ON public.order_payments
  FOR SELECT TO anon, authenticated
  USING (true);

-- 4. Allow anyone (anon & authenticated) to submit payment for an order
DROP POLICY IF EXISTS "Users insert own order payments" ON public.order_payments;
CREATE POLICY "Anyone insert order payments" ON public.order_payments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
    )
  );

-- 5. Allow updating order status when submitting payment
DROP POLICY IF EXISTS "Users update own orders" ON public.orders;
CREATE POLICY "Anyone update order status" ON public.orders
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Storage bucket policy for payment receipt upload for anon and authenticated
DROP POLICY IF EXISTS "Authenticated users upload payment receipts" ON storage.objects;
DROP POLICY IF EXISTS "Anyone upload payment receipts" ON storage.objects;
CREATE POLICY "Anyone upload payment receipts" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-receipts');
