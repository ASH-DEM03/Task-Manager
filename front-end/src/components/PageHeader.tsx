import React from "react";
import { Button } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: React.ReactNode;
}

// Shared header used by every screen (design only - no app logic here)
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backLabel = "Go back",
  actions,
}) => {
  return (
    <header className="flex items-center justify-between gap-3 mb-8">
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <Button
            isIconOnly
            variant="flat"
            radius="full"
            aria-label={backLabel}
            onPress={onBack}
            className="bg-white/5 hover:bg-white/10 shrink-0"
          >
            <ArrowLeft size={18} />
          </Button>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-default-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
};

export default PageHeader;
