import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "~/lib/util";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-ink-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full rounded-xl bg-white shadow-xl",
          sizeClasses[size],
          "max-h-[85dvh] overflow-y-auto"
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-ink-200 px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
