import type { ReactNode } from "react";

interface TrustItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface Props {
  items: TrustItem[];
}

export function TrustBar({ items }: Props) {
  if (items.length === 0) return null;
  return (
    <section className="container-x py-14 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <div key={i} className="text-center">
            <div className="icon-circle icon-circle-lg mx-auto">{item.icon}</div>
            <h3 className="mt-5 text-brand-800">{item.title}</h3>
            <p className="mt-2 text-ink-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
