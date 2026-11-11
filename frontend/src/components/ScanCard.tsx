import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  detail: string;
  Icon: LucideIcon;
  href: string;
}

export default function ScanCard({ title, description, detail, Icon, href }: Props) {
  return (
    <Link
      to={href}
      className="group flex flex-col bg-surface-card rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:border-brand hover:bg-surface-elevated transition-all duration-200 p-6 sm:p-8 cursor-pointer"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-surface-inner border border-border flex items-center justify-center mb-5 group-hover:border-brand/40 transition-colors">
        <Icon className="w-6 h-6 text-brand" strokeWidth={1.75} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-[#EEF2F4] mb-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-1.5">{description}</p>
      <p className="text-xs text-muted/70 leading-relaxed mb-6">{detail}</p>

      {/* CTA */}
      <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-brand group-hover:text-brand-hover group-hover:gap-2.5 transition-all">
        <span>Start analysis</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
