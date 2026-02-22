import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-neutral-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-red-800">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-red-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-300">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
