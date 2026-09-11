/**
 * Demo customer testimonials (isDemo: true — sample feedback for preview only).
 */
import type { Testimonial } from "~/lib/types";

export const demoTestimonials: Testimonial[] = [
  {
    id: "t-1001",
    clientName: "Thandi M.",
    eventType: "Matric Farewell",
    quote:
      "The venue looked absolutely stunning — the draping and table styling blew everyone away. Parents couldn't stop taking photos.",
    rating: 5,
    eventDate: "2025-10-18",
    isDemo: true,
  },
  {
    id: "t-1002",
    clientName: "Sarah & James V.",
    eventType: "Wedding",
    quote:
      "From the first quote to the last plate collected, everything was seamless. Our 120-guest wedding ran like clockwork.",
    rating: 5,
    eventDate: "2026-03-07",
    isDemo: true,
  },
  {
    id: "t-1003",
    clientName: "Lindiwe N. — Vertex Holdings",
    eventType: "Year-End Function",
    quote:
      "250 guests, a full gala setup, and zero stress on our side. INSPIRE DECOR delivered exactly what they promised.",
    rating: 5,
    eventDate: "2025-12-05",
    isDemo: true,
  },
  {
    id: "t-1004",
    clientName: "Kagiso M.",
    eventType: "40th Birthday",
    quote:
      "Beautiful, affordable and on time. The crockery and glassware hire made the party feel five-star.",
    rating: 4.5,
    eventDate: "2026-06-20",
    isDemo: true,
  },
];
