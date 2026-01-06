import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

type AlertVariant = "default" | "success" | "error";

interface CustomAlertProps {
  title?: string;
  description?: string;
  variant?: AlertVariant;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  default: "border-border text-foreground",
  success: "border-green-500/50 text-green-700 bg-green-50",
  error: "border-red-500/50 text-red-700 bg-red-50",
};

const variantIcons: Record<AlertVariant, React.ReactNode> = {
  default: <Info className="h-4 w-4" />,
  success: <CheckCircle className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
};

export function CustomAlert({
  title,
  description,
  variant = "default",
  className,
}: CustomAlertProps) {
  return (
    <Alert className={cn(variantStyles[variant], className)}>
      <div className="flex items-start gap-2">
        {variantIcons[variant]}

        <div className="flex flex-col items-start">
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
        </div>
      </div>
    </Alert>
  );
}
