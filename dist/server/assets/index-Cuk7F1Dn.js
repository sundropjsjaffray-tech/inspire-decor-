import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { C as CustomerLayout, I as Img } from "./CustomerLayout-Dmbsnk0W.js";
import { b as buttonClasses } from "./Modal-ce_tYN3H.js";
import { C as Card } from "./Card-Zmhmk8cF.js";
import { L as LoadingState } from "./LoadingState-O0lgS06L.js";
import { S as SectionHeading } from "./SectionHeading-BSrzX34P.js";
import { g as getServices, a as getGallery, b as getTestimonials, c as getDifferentiators } from "./content-L4BOmwm4.js";
import { g as getProducts, a as getCategories, u as unsplash } from "./products-BbopjXnd.js";
import "./util-D5Y4JTPp.js";
import "./demo-vg2AtRWs.js";
import "./EmptyState-BDGSXIRT.js";
import "./PriceTag-XtvFw5qZ.js";
import "./index-CtB_iAzP.js";
import "zustand";
import "zustand/middleware";
import "react-dom";
import "./site-Csrvuq7G.js";
const HERO_IMAGE = unsplash("1523580494863-6f3031224c94", 1600);
function HomePage() {
  const [services, setServices] = useState(null);
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [testimonials, setTestimonials] = useState(null);
  const [differentiators, setDifferentiators] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([getServices(), getProducts(), getCategories(), getGallery(), getTestimonials(), getDifferentiators()]).then(([svc, prod, cats, gal, testi, diff]) => {
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
    return /* @__PURE__ */ jsx(CustomerLayout, { children: /* @__PURE__ */ jsx(LoadingState, { label: "Loading INSPIRE DECOR…" }) });
  }
  const featuredServices = services.filter((s) => s.featured).slice(0, 4);
  const featuredCategoryIds = new Set(products.filter((p) => p.featured).map((p) => p.category));
  const popularCategories = categories.filter((c) => featuredCategoryIds.has(c.id)).slice(0, 4);
  const countFor = (id) => products.filter((p) => p.category === id).length;
  return /* @__PURE__ */ jsxs(CustomerLayout, { children: [
    /* @__PURE__ */ jsx("section", { "aria-label": "Introduction", className: "-mx-4 -mt-10 flex min-h-[78dvh] items-center bg-ink-950 bg-cover bg-center", style: {
      backgroundImage: `linear-gradient(rgba(16,18,22,0.62), rgba(16,18,22,0.78)), url(${HERO_IMAGE})`
    }, children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-6xl px-6 py-16 text-center sm:py-24", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-gold-300", children: "Event Décor · Hire · Styling · Full Setup" }),
      /* @__PURE__ */ jsx("h1", { className: "mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl", children: "Transforming Events Into Experiences" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-2xl text-base leading-relaxed text-champagne-100/90 sm:text-lg", children: "Event décor, draping, crockery, glassware, linen, backdrops and table styling — plus full event setup and complete corporate event solutions, delivered across Port Elizabeth, Eastern Cape by one team you can rely on." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row", children: [
        /* @__PURE__ */ jsx(Link, { to: "/quote", className: buttonClasses("primary", "lg"), children: "Plan My Event" }),
        /* @__PURE__ */ jsx(Link, { to: "/hire", className: buttonClasses("secondary", "lg") + " border-white/40 bg-white/10 text-white hover:border-gold-300 hover:text-gold-200", children: "Browse Hire Catalogue" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-8 text-xs uppercase tracking-widest text-champagne-200/60", children: "From intimate dinners to 500-guest galas" })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "featured-services", className: "py-14", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "What we do", title: "Services that carry the whole event", description: "One team for décor, hire equipment, styling and setup — planned together so nothing is left to chance.", className: "mb-8" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: featuredServices.map((service) => /* @__PURE__ */ jsxs(Card, { padded: false, className: "flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsx(Img, { src: service.image, alt: service.name, fallbackLabel: service.name, className: "aspect-[4/3] w-full object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-2 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-ink-900", children: service.name }),
          /* @__PURE__ */ jsx("p", { className: "flex-1 text-sm text-ink-500", children: service.description }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gold-700", children: service.priceLabel }),
          /* @__PURE__ */ jsx(Link, { to: "/quote", className: buttonClasses("secondary", "sm") + " mt-2 w-full", "aria-label": `Enquire about ${service.name}`, children: "Enquire" })
        ] })
      ] }, service.id)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(Link, { to: "/services", className: "text-sm font-medium text-gold-700 underline-offset-4 hover:underline", children: "See all 10 services →" }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "popular-hire", className: "py-14", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Hire catalogue", title: "Popular hire categories", description: "Daily hire rates, VAT included. Tables, chairs, crockery, glassware, linen and more from our own warehouse stock.", align: "center", className: "mb-8" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: popularCategories.map((category) => /* @__PURE__ */ jsxs(Link, { to: "/hire/$category", params: {
        category: category.id
      }, className: "group relative block overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md", children: [
        /* @__PURE__ */ jsx(Img, { src: category.image, alt: category.name, fallbackLabel: category.name, className: "aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent px-4 pb-3 pt-10", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-white", children: category.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-champagne-200/80", children: [
            countFor(category.id),
            " products to hire"
          ] })
        ] })
      ] }, category.id)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(Link, { to: "/hire", className: "text-sm font-medium text-gold-700 underline-offset-4 hover:underline", children: "Browse all 12 categories →" }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "recent-events", className: "py-14", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Recent events", title: "Moments we've styled", description: "Weddings, matric farewells, corporate galas and private celebrations — a glimpse of the work.", className: "mb-8" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: gallery.slice(0, 8).map((item) => /* @__PURE__ */ jsx(Img, { src: item.image, alt: item.caption, fallbackLabel: "Event", className: "aspect-square w-full rounded-xl object-cover" }, item.id)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(Link, { to: "/gallery", className: "text-sm font-medium text-gold-700 underline-offset-4 hover:underline", children: "View the full gallery →" }) })
    ] }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "corporate-pitch", className: "py-14", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-8 overflow-hidden rounded-2xl bg-ink-950 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-8 sm:p-10", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300", children: "Corporate events" }),
        /* @__PURE__ */ jsx("h2", { id: "corporate-pitch", className: "font-display text-2xl font-semibold text-white sm:text-3xl", children: "Your company event, handled end to end" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-champagne-100/80 sm:text-base", children: "Year-end functions, conferences, product launches, awards and staff events — décor, hire equipment and setup from a single supplier, planned around your brand and delivered on a schedule you can plan around." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/corporate", className: buttonClasses("primary"), children: "Explore Corporate" }),
          /* @__PURE__ */ jsx(Link, { to: "/quote", className: buttonClasses("secondary") + " border-white/40 bg-white/10 text-white hover:border-gold-300 hover:text-gold-200", children: "Request a Quote" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative hidden min-h-72 lg:block", children: /* @__PURE__ */ jsx(Img, { src: unsplash("1511795409834-ef04bbd61622", 1200), alt: "Corporate gala table styling", fallbackLabel: "Corporate", className: "absolute inset-0 h-full w-full object-cover" }) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "why-us", className: "py-14", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Why INSPIRE DECOR", title: "Why couples, families and companies choose us", align: "center", className: "mb-8" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: differentiators.map((d) => /* @__PURE__ */ jsxs(Card, { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm text-gold-600", children: "◆" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-semibold text-ink-900", children: d.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-ink-500", children: d.description })
        ] })
      ] }, d.id)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "testimonials", className: "py-14", children: [
      /* @__PURE__ */ jsx(SectionHeading, { eyebrow: "Kind words", title: "What our clients say", align: "center", className: "mb-8" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: testimonials.map((t) => /* @__PURE__ */ jsxs(Card, { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 text-sm text-gold-500", "aria-label": `${t.rating} out of 5 stars`, children: Array.from({
          length: 5
        }, (_, i) => /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: i < Math.round(t.rating) ? "★" : "☆" }, i)) }),
        /* @__PURE__ */ jsxs("p", { className: "flex-1 text-sm italic leading-relaxed text-ink-600", children: [
          "“",
          t.quote,
          "”"
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-ink-900", children: t.clientName }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-400", children: t.eventType })
        ] })
      ] }, t.id)) })
    ] }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "final-cta", className: "py-14", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-gold-100 via-champagne-200 to-gold-200 px-6 py-12 text-center sm:px-12", children: [
      /* @__PURE__ */ jsx("h2", { id: "final-cta", className: "font-display text-2xl font-semibold text-ink-950 sm:text-3xl", children: "Ready to plan your event?" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-3 max-w-xl text-sm text-ink-600 sm:text-base", children: "Tell us your date, venue and guest count — we'll come back within one working day with a tailored quote. No obligation, no pressure." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row", children: [
        /* @__PURE__ */ jsx(Link, { to: "/quote", className: buttonClasses("primary", "lg"), children: "Plan My Event" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: buttonClasses("secondary", "lg"), children: "Speak to Us" })
      ] })
    ] }) })
  ] });
}
export {
  HomePage as component
};
