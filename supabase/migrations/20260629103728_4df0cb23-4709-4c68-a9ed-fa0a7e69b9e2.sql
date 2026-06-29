
-- Lock down SECURITY DEFINER functions
ALTER FUNCTION public.has_role(UUID, public.app_role) SECURITY INVOKER;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Replace always-true insert policies with meaningful checks
DROP POLICY "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (length(customer_name) > 1 AND length(phone) > 4 AND length(address) > 2);

DROP POLICY "Anyone can create order_items" ON public.order_items;
CREATE POLICY "Anyone can create order_items" ON public.order_items FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id));
