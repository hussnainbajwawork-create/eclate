import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Phone, Check, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { INSTAGRAM_URL, FACEBOOK_URL } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ÉCLAT" },
      { name: "description", content: "Get in touch with the ÉCLAT atelier. WhatsApp, email or visit us in Lahore." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Message sent. We'll be in touch shortly.");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to send message. Please try WhatsApp instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-10 text-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Atelier ÉCLAT</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">Say Hello</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground">
          We respond to every message personally — usually within a few hours.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-16 px-6 pb-24 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-accent/10">
              <MapPin className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="font-serif text-lg">Atelier</h3>
              <p className="mt-1 text-sm text-muted-foreground">Gulberg III, Lahore · Pakistan</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-accent/10">
              <Phone className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="font-serif text-lg">Phone</h3>
              <p className="mt-1 text-sm text-muted-foreground">+92 322 7505007</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-accent/10">
              <Mail className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="font-serif text-lg">Email</h3>
              <a href="mailto:hello@eclat.pk" className="mt-1 block text-sm text-muted-foreground link-underline">
                hello@eclat.pk
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="border-t border-border/60 pt-6">
            <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">Follow Us</h3>
            <div className="mt-4 flex gap-4">
              <a
                href="https://wa.me/923227505007?text=Hello%20%C3%89CLAT"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition hover:border-[#25D366] hover:text-[#25D366]"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition hover:border-[#E1306C] hover:text-[#E1306C]"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition hover:border-[#1877F2] hover:text-[#1877F2]"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick WhatsApp CTA */}
          <a
            href="https://wa.me/923227505007?text=Hello%20%C3%89CLAT%2C%20I'd%20like%20to%20get%20in%20touch."
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] px-6 py-4 text-xs uppercase tracking-luxe text-white transition hover:bg-[#20BD5C]"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>

        {/* Contact Form */}
        <div className="border border-border/60 bg-card p-8">
          <h2 className="font-serif text-2xl">Send a message</h2>
          {sent ? (
            <div className="mt-8 flex flex-col items-center py-8 text-center animate-fade-up">
              <div className="flex h-14 w-14 items-center justify-center border border-accent text-accent">
                <Check className="h-6 w-6" />
              </div>
              <p className="mt-4 font-serif text-xl">Thank you.</p>
              <p className="mt-2 text-sm text-muted-foreground">Our team will reply to you within 24 hours.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                className="mt-6 text-xs uppercase tracking-luxe link-underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-luxe text-muted-foreground">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-luxe text-muted-foreground">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-luxe text-muted-foreground">Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-gold flex w-full items-center justify-center gap-2 py-4 text-xs uppercase tracking-luxe disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
