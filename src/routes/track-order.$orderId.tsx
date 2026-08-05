import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Package, Clock, CheckCircle, Truck, CreditCard, ShieldCheck,
  XCircle, ArrowLeft, Banknote, ImageIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { formatPKR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/track-order/$orderId")({
  head: () => ({ meta: [{ title: "Track Order — ÉCLAT" }] }),
  component: TrackOrderPage,
});

type OrderData = {
  id: string;
  total: number;
  status: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: { name_snapshot: string; qty: number; price_snapshot: number; color: string | null; size: string | null }[];
};

type PaymentData = {
  id: string;
  transaction_id: string;
  bank_name: string;
  amount: number;
  receipt_url: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
};

const STATUS_FLOW = [
  { key: "pending", label: "Order Placed", desc: "Your order has been received. Complete online payment if selected or await cash delivery.", icon: Package },
  { key: "payment_submitted", label: "Payment Submitted", desc: "Your payment proof is under review by our team.", icon: CreditCard },
  { key: "confirmed", label: "Payment Approved", desc: "Payment verified! Your order is now confirmed and being prepared.", icon: ShieldCheck },
  { key: "shipped", label: "Shipped", desc: "Your order is on its way to you.", icon: Truck },
  { key: "delivered", label: "Delivered", desc: "Your order has been delivered. Thank you for shopping with ÉCLAT!", icon: CheckCircle },
];

function TrackOrderPage() {
  const { orderId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase
        .from("orders")
        .select("id,total,status,customer_name,phone,email,address,city,notes,created_at,updated_at,order_items(name_snapshot,qty,price_snapshot,color,size)")
        .eq("id", orderId)
        .maybeSingle(),
      supabase
        .from("order_payments")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle(),
    ]).then(([orderRes, paymentRes]) => {
      if (orderRes.error || !orderRes.data) {
        setOrder(null);
        setLoading(false);
        return;
      }
      setOrder(orderRes.data as any);
      if (paymentRes.data) setPayment(paymentRes.data as any);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setOrder(null);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-5xl px-6 py-32 text-center text-sm text-muted-foreground">Loading order details…</div>
      </SiteLayout>
    );
  }

  if (!order) {
    return (
      <SiteLayout>
        <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center animate-fade-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-serif text-3xl md:text-4xl">Order Not Found</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            We couldn't find an order matching <span className="font-mono text-foreground">#{orderId.slice(0, 8)}</span>.
            Please verify the order link or Order ID and try again.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/" className="btn-gold px-6 py-3 text-xs uppercase tracking-luxe">
              Return to Home
            </Link>
            <Link to="/contact" className="border border-border px-6 py-3 text-xs uppercase tracking-luxe hover:border-foreground">
              Contact Support
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentIdx = STATUS_FLOW.findIndex((s) => s.key === order.status);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        {/* Header */}
        <Link to="/account" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-luxe text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to Account
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">Order Tracking</span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">Order #{orderId.slice(0, 8)}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          {order.status === "pending" && !payment && (
            <button
              onClick={() => navigate({ to: "/pay/$orderId", params: { orderId } })}
              className="btn-gold flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-luxe"
            >
              <CreditCard className="h-4 w-4" /> Submit Payment Details
            </button>
          )}
        </div>

        {/* Status Timeline */}
        <div className="mt-12 border border-border/60 bg-card p-8">
          <h2 className="font-serif text-2xl">Order Status</h2>

          {isCancelled ? (
            <div className="mt-6 flex items-center gap-3 bg-red-50 px-5 py-4 text-sm dark:bg-red-900/20">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">Order Cancelled</p>
                <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/60">This order has been cancelled.</p>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-0">
              {STATUS_FLOW.map((step, i) => {
                const Icon = step.icon;
                const isDone = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const isLast = i === STATUS_FLOW.length - 1;

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          isCurrent
                            ? "border-accent bg-accent/10 text-accent"
                            : isDone
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                              : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 flex-1 min-h-8 ${isDone && i < currentIdx ? "bg-emerald-500" : "bg-border"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                      <h3 className={`text-sm font-medium ${isCurrent ? "text-accent" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                        {isCurrent && (
                          <span className="ml-2 inline-flex items-center gap-1 bg-accent/10 px-2 py-0.5 text-[9px] uppercase tracking-luxe text-accent">
                            Current
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground max-w-md">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Payment Info */}
          <div className="border border-border/60 bg-card p-6">
            <h3 className="flex items-center gap-2 font-serif text-xl">
              <Banknote className="h-4 w-4 text-accent" /> Payment Details
            </h3>
            {payment ? (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Method</dt><dd className="font-medium">{payment.bank_name}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Transaction ID</dt><dd className="font-mono text-xs">{payment.transaction_id}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Amount Paid</dt><dd className="font-serif">{formatPKR(payment.amount)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Payment Status</dt>
                  <dd>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-luxe ${
                      payment.status === "approved"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : payment.status === "rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {payment.status === "approved" && <CheckCircle className="h-3 w-3" />}
                      {payment.status === "rejected" && <XCircle className="h-3 w-3" />}
                      {payment.status === "pending_review" && <Clock className="h-3 w-3" />}
                      {payment.status.replace("_", " ")}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Submitted</dt><dd className="text-xs">{new Date(payment.created_at).toLocaleString()}</dd></div>
                {payment.admin_notes && (
                  <div className="mt-2 border-t border-border/60 pt-2">
                    <dt className="text-muted-foreground text-xs">Admin Notes</dt>
                    <dd className="mt-1 text-sm">{payment.admin_notes}</dd>
                  </div>
                )}
                {payment.receipt_url && (
                  <button
                    onClick={() => setShowReceipt(true)}
                    className="mt-3 flex items-center gap-2 text-xs uppercase tracking-luxe text-accent hover:underline"
                  >
                    <ImageIcon className="h-3 w-3" /> View Receipt
                  </button>
                )}
              </dl>
            ) : (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>{order.notes?.includes("Cash on Delivery") ? "Cash on Delivery order." : "No online payment submitted yet."}</p>
                {order.status === "pending" && !order.notes?.includes("Cash on Delivery") && (
                  <button
                    onClick={() => navigate({ to: "/pay/$orderId", params: { orderId } })}
                    className="btn-gold mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-luxe"
                  >
                    <CreditCard className="h-3.5 w-3.5" /> Submit Payment Details
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="border border-border/60 bg-card p-6">
            <h3 className="font-serif text-xl">Order Items</h3>
            <ul className="mt-4 divide-y divide-border/60 text-sm">
              {order.order_items.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between py-3">
                  <span>
                    {item.name_snapshot}
                    {item.color && <span className="text-muted-foreground"> · {item.color}</span>}
                    {item.size && <span className="text-muted-foreground"> · {item.size}</span>}
                    <span className="text-muted-foreground"> × {item.qty}</span>
                  </span>
                  <span>{formatPKR(Number(item.price_snapshot) * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-3">
              <span className="text-xs uppercase tracking-luxe text-muted-foreground">Total</span>
              <span className="font-serif text-xl">{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-8 border border-border/60 bg-card p-6">
          <h3 className="font-serif text-xl">Delivery Details</h3>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div className="flex gap-2"><dt className="text-muted-foreground">Name:</dt><dd>{order.customer_name}</dd></div>
            <div className="flex gap-2"><dt className="text-muted-foreground">Phone:</dt><dd>{order.phone}</dd></div>
            <div className="flex gap-2"><dt className="text-muted-foreground">Address:</dt><dd>{order.address}, {order.city}</dd></div>
            {order.notes && <div className="flex gap-2"><dt className="text-muted-foreground">Notes:</dt><dd>{order.notes}</dd></div>}
          </dl>
        </div>
      </section>

      {/* Receipt Lightbox */}
      {showReceipt && payment?.receipt_url && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowReceipt(false)}
        >
          <div className="max-h-[90vh] max-w-2xl overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={payment.receipt_url} alt="Payment receipt" className="w-full rounded border border-border" />
            <button
              onClick={() => setShowReceipt(false)}
              className="mt-4 mx-auto block border border-white/30 px-6 py-2 text-xs uppercase tracking-luxe text-white hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}

