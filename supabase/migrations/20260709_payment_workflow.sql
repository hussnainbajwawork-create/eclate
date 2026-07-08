-- =====================================================
-- Payment Workflow Migration
-- Adds order_payments table, payment-receipts bucket,
-- and payment_submitted status to order_status enum.
-- =====================================================

-- 1. Add 'payment_submitted' value to order_status enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'payment_submitted' AFTER 'pending';

-- 2. Create order_payments table
CREATE TABLE public.order_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  receipt_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- Grants
GRANT SELECT, INSERT ON public.order_payments TO authenticated;
GRANT ALL ON public.order_payments TO service_role;
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_payments
-- Customers can insert payment for their own orders
CREATE POLICY "Users insert own order payments" ON public.order_payments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- Customers can view payment for their own orders
CREATE POLICY "Users view own order payments" ON public.order_payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins view all order payments" ON public.order_payments
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update payment status (approve/reject)
CREATE POLICY "Admins update order payments" ON public.order_payments
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_order_payments_order ON public.order_payments(order_id);
CREATE INDEX idx_order_payments_status ON public.order_payments(status, created_at DESC);

-- 3. Allow authenticated users to update their own orders (for status change to payment_submitted)
-- We need a policy that lets users update their own order status when submitting payment
CREATE POLICY "Users update own orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Storage bucket for payment receipts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-receipts',
  'payment-receipts',
  true,
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment receipts
CREATE POLICY "Public read payment receipts" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-receipts');

CREATE POLICY "Authenticated users upload payment receipts" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-receipts');

CREATE POLICY "Admins delete payment receipts" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'payment-receipts' AND public.has_role(auth.uid(), 'admin'));
