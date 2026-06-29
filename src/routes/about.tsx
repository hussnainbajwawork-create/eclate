import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ÉCLAT" },
      { name: "description", content: "ÉCLAT — a Pakistani maison of leather, born of quiet luxury and contemporary form." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=2000&q=80"
          alt="ÉCLAT atelier"
          className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <span className="text-xs uppercase tracking-luxe text-white/80">The Maison</span>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl">Made by hand. Made to last.</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-16 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Our Story</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            ÉCLAT was born in Lahore from a quiet conviction: that Pakistan deserved a luxury house of its own — one rooted
            in heritage craft and contemporary form. Each piece is finished by hand in our small atelier, using full-grain
            leathers, solid brass hardware and a discipline of restraint.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We believe in fewer, finer things. Bags and shoes that age with grace, carried for years rather than seasons.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl">Our Values</h2>
          <ul className="mt-6 space-y-4 text-sm">
            {[
              ["Craft first", "Hand-cut, hand-stitched, hand-finished."],
              ["Quiet luxury", "Considered proportions, no shouting logos."],
              ["Made in Pakistan", "Local artisans, fairly paid."],
              ["Built to last", "Lifetime craftsmanship guarantee."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-4">
                <span className="mt-2 h-px w-6 bg-accent" />
                <div>
                  <h3 className="font-serif text-lg">{t}</h3>
                  <p className="text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
