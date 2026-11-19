"use client";

import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleX,
  Info,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type StatusDialogVariant =
  | "warning"
  | "error"
  | "info"
  | "question"
  | "success";

interface StatusPresentation {
  icon: LucideIcon;
  iconContainerClassName: string;
  iconClassName: string;
}

const STATUS_PRESENTATIONS: Record<StatusDialogVariant, StatusPresentation> = {
  warning: {
    icon: CircleAlert,
    iconContainerClassName: "bg-amber-100",
    iconClassName: "text-amber-700",
  },
  error: {
    icon: CircleX,
    iconContainerClassName: "bg-red-100",
    iconClassName: "text-red-700",
  },
  info: {
    icon: Info,
    iconContainerClassName: "bg-blue-100",
    iconClassName: "text-blue-700",
  },
  question: {
    icon: CircleHelp,
    iconContainerClassName: "bg-slate-100",
    iconClassName: "text-slate-700",
  },
  success: {
    icon: CircleCheck,
    iconContainerClassName: "bg-emerald-100",
    iconClassName: "text-emerald-700",
  },
};

export interface StatusDialogContentProps {
  variant: StatusDialogVariant;
  title: string;
  description: string;
  actionLabel?: string;
  onAction: () => void;
}

export function StatusDialogBody({
  variant,
  title,
  description,
  actionLabel = "Close",
  onAction,
}: StatusDialogContentProps) {
  const presentation = STATUS_PRESENTATIONS[variant];
  const Icon = presentation.icon;

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 p-6">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          presentation.iconContainerClassName,
        )}
      >
        <Icon
          className={cn("size-5", presentation.iconClassName)}
          aria-hidden
        />
      </div>
      <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
      <DialogDescription className="col-span-2 mt-2 text-pretty text-sm/6 sm:col-span-1 sm:col-start-2 sm:mt-0.5">
        {description}
      </DialogDescription>
      <div className="col-span-2 mt-6 flex justify-end">
        <Button type="button" className="h-11 px-4 md:h-10" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export function StatusDialogContent(props: StatusDialogContentProps) {
  return (
    <DialogContent showCloseButton={false} className="p-0 sm:max-w-md">
      <StatusDialogBody {...props} />
    </DialogContent>
  );
}
