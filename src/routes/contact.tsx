import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { INSTAGRAM_URL, FACEBOOK_URL, WHATSAPP_NUMBER, whatsappLink } from "@/lib/format";

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
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-10 text-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Atelier ÉCLAT</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">Say Hello</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground">
          We respond to every message personally — usually within a few hours.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-16 px-6 pb-24 md:grid-cols-2">
        <div className="space-y-6 text-sm">
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-4 w-4 text-accent" />
            <div>
              <h3 className="font-serif text-lg">Atelier</h3>
              <p className="text-muted-foreground">Gulberg III, Lahore · Pakistan</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="mt-1 h-4 w-4 text-accent" />
            <div>
              <h3 className="font-serif text-lg">Phone</h3>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-muted-foreground link-underline">+{WHATSAPP_NUMBER}</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="mt-1 h-4 w-4 text-accent" />
            <div>
              <h3 className="font-serif text-lg">Email</h3>
              <a href="mailto:hello@eclat.pk" className="text-muted-foreground link-underline">hello@eclat.pk</a>
            </div>
          </div>
          <div className="flex items-center gap-5 pt-4">
            <a href={whatsappLink("Hello ÉCLAT")} target="_blank" rel="noreferrer" className="link-underline flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="link-underline flex items-center gap-2 text-sm">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="link-underline flex items-center gap-2 text-sm">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Message sent. We'll be in touch shortly.");
          }}
          className="space-y-5 border border-border/60 bg-card p-8"
        >
          <h2 className="font-serif text-2xl">Send a message</h2>
          {sent ? (
            <p className="text-sm text-muted-foreground">Thank you. Our team will reply to you within 24 hours.</p>
          ) : (
            <>
              <input required placeholder="Name" className="w-full border-0 border-b border-border bg-transparent py-3 text-sm focus:border-accent focus:outline-none" />
              <input required type="email" placeholder="Email" className="w-full border-0 border-b border-border bg-transparent py-3 text-sm focus:border-accent focus:outline-none" />
              <textarea required placeholder="Message" rows={5} className="w-full border-0 border-b border-border bg-transparent py-3 text-sm focus:border-accent focus:outline-none" />
              <button type="submit" className="btn-gold w-full py-4 text-xs uppercase tracking-luxe">Send</button>
            </>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}
