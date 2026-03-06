import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  inverted?: boolean;
};

export function Breadcrumbs({
  items,
  className = "",
  inverted = false,
}: BreadcrumbsProps) {
  const linkClass = inverted
    ? "text-white/65 hover:text-white"
    : "text-muted-foreground hover:text-foreground";
  const currentClass = inverted ? "text-white" : "text-foreground";
  const dividerClass = inverted ? "text-white/35" : "text-muted-foreground/60";

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className={`transition-colors ${linkClass}`}>
                  {item.label}
                </Link>
              ) : (
                <span className={currentClass}>{item.label}</span>
              )}
              {!isLast && <ChevronRight className={`h-4 w-4 ${dividerClass}`} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
