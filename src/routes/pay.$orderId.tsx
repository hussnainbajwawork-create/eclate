import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Upload, CreditCard, CheckCircle, ShieldCheck, Banknote, Smartphone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { formatPKR, PAYMENT_METHODS, STORE_PAYMENT_INFO } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const Route = createFileRoute("/pay/$orderId")({
  head: () => ({ meta: [{ title: "Submit Payment — ÉCLAT" }] }),
  component: PaymentPage,
});

type OrderData = {
  id: string;
  total: number;
  status: string;
  customer_name: string;
  order_items: { name_snapshot: string; qty: number; price_snapshot: number }[];
};

const inputCls = "w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none";

function PaymentPage() {
  const { orderId } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptPreview, setReceiptPreview] = useState("");

  const advanceAmount = order ? Math.ceil(Number(order.total) * 0.2) : 0;

  // Load order
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    supabase
      .from("orders")
      .select("id,total,status,customer_name,order_items(name_snapshot,qty,price_snapshot)")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }: { data: any, error: any }) => {
        if (error || !data) {
          toast.error("Order not found or access denied");
          navigate({ to: "/account" });
          return;
        }
        setOrder(data as any);
        setLoadingOrder(false);
      });
  }, [orderId, user, authLoading, navigate]);

  // Check if payment already exists
  useEffect(() => {
    if (!order) return;
    supabase
      .from("order_payments")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle()
      .then(({ data }: { data: any }) => {
        if (data) setSubmitted(true);
      });
  }, [order]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${orderId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("payment-receipts")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("payment-receipts").getPublicUrl(path);
      setReceiptUrl(data.publicUrl);
      setReceiptPreview(URL.createObjectURL(file));
      toast.success("Receipt uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!order || !user) return;
    if (!receiptUrl) {
      toast.error("Please upload a payment screenshot");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const transaction_id = String(fd.get("transaction_id") ?? "").trim();
      const bank_name = String(fd.get("bank_name") ?? "").trim();

      if (!transaction_id || !bank_name) {
        toast.error("Please fill in all payment details");
        setSubmitting(false);
        return;
      }

      // Insert payment record
      const { error: payError } = await supabase.from("order_payments").insert({
        order_id: order.id,
        transaction_id,
        bank_name,
        amount: advanceAmount,
        receipt_url: receiptUrl,
      });
      if (payError) throw payError;

      // Update order status to payment_submitted
      const { error: statusError } = await supabase
        .from("orders")
        .update({ status: "payment_submitted" as any })
        .eq("id", order.id);
      if (statusError) throw statusError;

      setSubmitted(true);
      toast.success("Payment details submitted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loadingOrder) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-5xl px-6 py-32 text-center text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  /* ── Payment already submitted ── */
  if (submitted) {
    return (
      <SiteLayout>
        <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center animate-fade-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500 text-emerald-500">
            <CheckCircle className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-serif text-4xl md:text-5xl">Payment Submitted</h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Your payment proof for order <span className="font-mono text-foreground">#{orderId.slice(0, 8)}</span> has been
            submitted. Our team will review and verify your payment shortly.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            You can track your order status from your account page.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate({ to: "/track-order/$orderId", params: { orderId } })}
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-luxe"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate({ to: "/account" })}
              className="border border-border px-6 py-4 text-xs uppercase tracking-luxe link-underline"
            >
              Go to My Account
            </button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  if (!order) return null;

  /* ── Payment form ── */
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Payment</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">Submit Payment</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground">
          Pay <strong className="text-foreground">{formatPKR(advanceAmount)}</strong> (20% advance) for order
          <span className="font-mono ml-1">#{orderId.slice(0, 8)}</span> and submit the proof below.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Payment Form */}
          <form onSubmit={onSubmit} className="border border-border/60 bg-card p-8 animate-fade-up">
            <h2 className="font-serif text-2xl">Payment Proof</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Transfer the advance amount using any of the methods below, then fill in the details.
            </p>

            <div className="mt-8 grid gap-5">
              {/* Payment Method / Bank Name */}
              <label className="block">
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Payment Method / Bank</span>
                <select name="bank_name" required className={inputCls + " mt-1"}>
                  <option value="">Select payment method…</option>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  <option value="other">Other Bank</option>
                </select>
              </label>

              {/* Transaction ID */}
              <label className="block">
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Transaction / Reference ID</span>
                <input
                  name="transaction_id"
                  required
                  placeholder="e.g. TXN123456789"
                  className={inputCls + " mt-1"}
                />
              </label>

              {/* Receipt Upload */}
              <div>
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Payment Screenshot / Receipt</span>
                <div className="mt-2">
                  {receiptPreview ? (
                    <div className="relative">
                      <img src={receiptPreview} alt="Receipt preview" className="max-h-64 w-full rounded border border-border object-contain bg-secondary" />
                      <button
                        type="button"
                        onClick={() => { setReceiptUrl(""); setReceiptPreview(""); }}
                        className="absolute right-2 top-2 bg-black/60 px-2 py-1 text-[10px] text-white uppercase tracking-luxe hover:bg-black/80"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border py-12 text-muted-foreground transition hover:border-accent hover:text-accent">
                      <Upload className="h-8 w-8" />
                      <span className="mt-3 text-xs uppercase tracking-luxe">
                        {uploading ? "Uploading…" : "Click to upload receipt"}
                      </span>
                      <span className="mt-1 text-[10px] text-muted-foreground">JPG, PNG, PDF up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !receiptUrl}
              className="btn-gold mt-8 flex w-full items-center justify-center gap-2 py-5 text-xs uppercase tracking-luxe disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit Payment Proof"}
            </button>
          </form>

          {/* Sidebar: Payment info + Order summary */}
          <aside className="space-y-6">
            {/* Bank Details */}
            <div className="border border-border/60 bg-card p-6">
              <h3 className="flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Where to Pay
              </h3>

              {/* Bank Transfer */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-luxe text-accent">
                  <Banknote className="h-3.5 w-3.5" /> Bank Transfer
                </div>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Bank</dt><dd className="font-medium">{STORE_PAYMENT_INFO.bankName}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Title</dt><dd className="font-medium">{STORE_PAYMENT_INFO.accountTitle}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Account</dt><dd className="font-mono text-xs">{STORE_PAYMENT_INFO.accountNumber}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">IBAN</dt><dd className="font-mono text-xs">{STORE_PAYMENT_INFO.iban}</dd></div>
                </dl>
              </div>

              <div className="mt-5 flex items-baseline justify-between border-t border-border/60 pt-4">
                <span className="text-xs uppercase tracking-luxe text-muted-foreground">Amount Due</span>
                <span className="font-serif text-2xl text-accent">{formatPKR(advanceAmount)}</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border border-border/60 bg-card p-6">
              <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">Order Summary</h3>
              <ul className="mt-4 divide-y divide-border/60 text-sm">
                {order.order_items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between py-2">
                    <span>
                      {item.name_snapshot}
                      <span className="text-muted-foreground"> × {item.qty}</span>
                    </span>
                    <span>{formatPKR(Number(item.price_snapshot) * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-3">
                <span className="text-xs uppercase tracking-luxe text-muted-foreground">Order Total</span>
                <span className="font-serif text-lg">{formatPKR(order.total)}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-luxe text-accent">20% Advance</span>
                <span className="font-serif text-lg text-accent">{formatPKR(advanceAmount)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
