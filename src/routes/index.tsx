import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import { Card, Img, LoadingState, SectionHeading, buttonClasses } from "~/components/ui";
import { getServices, getGallery, getTestimonials, getDifferentiators } from "~/lib/services/content";
import { getCategories, getProducts } from "~/lib/services/products";
import { unsplash } from "~/lib/images";
import type { Category, GalleryItem, Product, Service, Testimonial } from "~/lib/types";
import type { Differentiator } from "~/lib/data/site";

export const Route = createFileRoute("/")({ component: HomePage });

const HERO_IMAGE = unsplash("1523580494863-6f3031224c94", 1600);

function HomePage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[] | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);
  const [differentiators, setDifferentiators] = useState<Differentiator[] | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      getServices(),
      getProducts(),
      getCategories(),
      getGallery(),
      getTestimonials(),
      getDifferentiators(),
    ]).then(([svc, prod, cats, gal, testi, diff]) => {
      if (!alive) return;
      setServices(svc);
      setProducts(prod);
      setCategories(cats);
      setGallery(gal);
      setTestimonials(testi);
      setDifferentiators(diff);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!services || !products || !categories || !gallery || !testimonials || !differentiators) {
    return (
      <CustomerLayout>
        <LoadingState label="Loading INSPIRE DECOR…" />
      </CustomerLayout>
    );
  }

  const featuredServices = services.filter((s) => s.featured).slice(0, 4);

  // Popular hire categories = categories of featured catalogue products.
  const featuredCategoryIds = new Set(products.filter((p) => p.featured).map((p) => p.category));
  const popularCategories = categories.filter((c) => featuredCategoryIds.has(c.id)).slice(0, 4);
  const countFor = (id: string) => products.filter((p) => p.category === id).length;

  return (
    <CustomerLayout>
      {/* ---------- Hero ---------- */}
      <section
        aria-label="Introduction"
        className="-mx-4 -mt-10 flex min-h-[78dvh] items-center bg-ink-950 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(16,18,22,0.62), rgba(16,18,22,0.78)), url(${HERO_IMAGE})` }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center sm:py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-gold-300">
            Event Décor · Hire · Styling · Full Setup
          </p>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Transforming Events Into Experiences
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-champagne-100/90 sm:text-lg">
            Event décor, draping, crockery, glassware, linen, backdrops and table styling — plus full
            event setup and complete corporate event solutions, delivered across Gauteng by one team
            you can rely on.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/quote" className={buttonClasses("primary", "lg")}>
              Plan My Event
            </Link>
            <Link
              to="/hire"
              className={buttonClasses("secondary", "lg") + " border-white/40 bg-white/10 text-white hover:border-gold-300 hover:text-gold-200"}
            >
              Browse Hire Catalogue
            </Link>
          </div>
          <p className="mt-8 text-xs uppercase tracking-widest text-champagne-200/60">
            From intimate dinners to 500-guest galas
          </p>
        </div>
      </section>

      {/* ---------- Featured services ---------- */}
      <section aria-labelledby="featured-services" className="py-14">
        <SectionHeading
          eyebrow="What we do"
          title="Services that carry the whole event"
          description="One team for décor, hire equipment, styling and setup — planned together so nothing is left to chance."
          className="mb-8"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service) => (
            <Card key={service.id} padded={false} className="flex flex-col overflow-hidden">
              <Img
                src={service.image}
                alt={service.name}
                fallbackLabel={service.name}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-lg font-semibold text-ink-900">{service.name}</h3>
                <p className="flex-1 text-sm text-ink-500">{service.description}</p>
                <p className="text-sm font-semibold text-gold-700">{service.priceLabel}</p>
                <Link
                  to="/quote"
                  className={buttonClasses("secondary", "sm") + " mt-2 w-full"}
                  aria-label={`Enquire about ${service.name}`}
                >
                  Enquire
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/services" className="text-sm font-medium text-gold-700 underline-offset-4 hover:underline">
            See all 10 services →
          </Link>
        </div>
      </section>

      {/* ---------- Popular hire categories ---------- */}
      <section aria-labelledby="popular-hire" className="py-14">
        <SectionHeading
          eyebrow="Hire catalogue"
          title="Popular hire categories"
          description="Daily hire rates, VAT included. Tables, chairs, crockery, glassware, linen and more from our own warehouse stock."
          align="center"
          className="mb-8"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularCategories.map((category) => (
            <Link
              key={category.id}
              to="/hire/$category"
              params={{ category: category.id }}
              className="group relative block overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <Img
                src={category.image}
                alt={category.name}
                fallbackLabel={category.name}
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent px-4 pb-3 pt-10">
                <h3 className="font-display text-lg font-semibold text-white">{category.name}</h3>
                <p className="text-xs text-champagne-200/80">{countFor(category.id)} products to hire</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/hire" className="text-sm font-medium text-gold-700 underline-offset-4 hover:underline">
            Browse all 12 categories →
          </Link>
        </div>
      </section>

      {/* ---------- Gallery strip ---------- */}
      <section aria-labelledby="recent-events" className="py-14">
        <SectionHeading
          eyebrow="Recent events"
          title="Moments we've styled"
          description="Weddings, matric farewells, corporate galas and private celebrations — a glimpse of the work."
          className="mb-8"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gallery.slice(0, 8).map((item) => (
            <Img
              key={item.id}
              src={item.image}
              alt={item.caption}
              fallbackLabel="Event"
              className="aspect-square w-full rounded-xl object-cover"
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/gallery" className="text-sm font-medium text-gold-700 underline-offset-4 hover:underline">
            View the full gallery →
          </Link>
        </div>
      </section>

      {/* ---------- Corporate ---------- */}
      <section aria-labelledby="corporate-pitch" className="py-14">
        <div className="grid items-center gap-8 overflow-hidden rounded-2xl bg-ink-950 lg:grid-cols-2">
          <div className="p-8 sm:p-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
              Corporate events
            </p>
            <h2 id="corporate-pitch" className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Your company event, handled end to end
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-champagne-100/80 sm:text-base">
              Year-end functions, conferences, product launches, awards and staff events — décor, hire
              equipment and setup from a single supplier, planned around your brand and delivered on a
              schedule you can plan around.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/corporate" className={buttonClasses("primary")}>
                Explore Corporate
              </Link>
              <Link
                to="/quote"
                className={buttonClasses("secondary") + " border-white/40 bg-white/10 text-white hover:border-gold-300 hover:text-gold-200"}
              >
                Request a Quote
              </Link>
            </div>
          </div>
          <div className="relative hidden min-h-72 lg:block">
            <Img
              src={unsplash("1511795409834-ef04bbd61622", 1200)}
              alt="Corporate gala table styling"
              fallbackLabel="Corporate"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ---------- Why choose us ---------- */}
      <section aria-labelledby="why-us" className="py-14">
        <SectionHeading
          eyebrow="Why INSPIRE DECOR"
          title="Why couples, families and companies choose us"
          align="center"
          className="mb-8"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((d) => (
            <Card key={d.id} className="flex gap-4">
              <span aria-hidden="true" className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm text-gold-600">
                ◆
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-900">{d.title}</h3>
                <p className="mt-1 text-sm text-ink-500">{d.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section aria-labelledby="testimonials" className="py-14">
        <SectionHeading
          eyebrow="Kind words"
          title="What our clients say"
          align="center"
          className="mb-8"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-1 text-sm text-gold-500" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} aria-hidden="true">
                    {i < Math.round(t.rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <p className="flex-1 text-sm italic leading-relaxed text-ink-600">“{t.quote}”</p>
              <div>
                <p className="text-sm font-semibold text-ink-900">{t.clientName}</p>
                <p className="text-xs text-ink-400">{t.eventType}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section aria-labelledby="final-cta" className="py-14">
        <div className="rounded-2xl bg-gradient-to-br from-gold-100 via-champagne-200 to-gold-200 px-6 py-12 text-center sm:px-12">
          <h2 id="final-cta" className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
            Ready to plan your event?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-600 sm:text-base">
            Tell us your date, venue and guest count — we'll come back within one working day with a
            tailored quote. No obligation, no pressure.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/quote" className={buttonClasses("primary", "lg")}>
              Plan My Event
            </Link>
            <Link to="/contact" className={buttonClasses("secondary", "lg")}>
              Speak to Us
            </Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
