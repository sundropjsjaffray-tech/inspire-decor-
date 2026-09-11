import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "~/components/layout/CustomerLayout";
import { Card, Img, LoadingState, PageHeader, PriceTag, buttonClasses } from "~/components/ui";
import { getServices } from "~/lib/services/content";
import type { Service } from "~/lib/types";

export const Route = createFileRoute("/services")({ component: ServicesPage });

function ServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    let alive = true;
    getServices().then((list) => {
      if (alive) setServices(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <CustomerLayout>
      <PageHeader
        title="Our Services"
        eyebrow="What we do"
        subtitle="Ten ways we carry your event — hire one service or let us plan the whole thing. All prices are demo rates, VAT inclusive."
      />
      {!services ? (
        <LoadingState label="Loading services…" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} padded={false} className="flex flex-col overflow-hidden">
              <Img
                src={service.image}
                alt={service.name}
                fallbackLabel={service.name}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="font-display text-lg font-semibold text-ink-900">{service.name}</h2>
                <p className="flex-1 text-sm leading-relaxed text-ink-500">{service.description}</p>
                <div className="flex items-baseline justify-between gap-2 border-t border-ink-100 pt-3">
                  {service.startingPrice !== null ? (
                    <div>
                      <PriceTag amount={service.startingPrice} prefix="From" />
                      <p className="mt-0.5 text-xs text-ink-400">{service.priceLabel}</p>
                    </div>
                  ) : (
                    <PriceTag amount={0} custom />
                  )}
                </div>
                <Link
                  to="/quote"
                  className={buttonClasses("primary", "sm") + " mt-2 w-full"}
                  aria-label={`Enquire about ${service.name}`}
                >
                  Enquire
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
      <p className="mt-8 text-center text-xs text-ink-400">
        Not sure what you need?{" "}
        <Link to="/consultation" className="font-medium text-gold-700 underline-offset-4 hover:underline">
          Book a free consultation
        </Link>{" "}
        and we'll help you shape it.
      </p>
    </CustomerLayout>
  );
}
