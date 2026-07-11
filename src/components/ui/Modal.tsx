"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
}

const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ open, onClose, title, description, children, size = "md", footer }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 w-full animate-fade-in rounded-t-2xl bg-white shadow-card-hover sm:rounded-2xl",
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy-100 p-5">
          <div>
            {title && <h2 className="text-lg font-semibold text-navy-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-navy-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children && <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>}
        {footer && <div className="flex justify-end gap-2 border-t border-navy-100 p-5">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  danger,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        {danger && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </span>
        )}
        <div>
          <h2 className="text-base font-semibold text-navy-900">{title}</h2>
          <p className="mt-1 text-sm text-navy-500">{description}</p>
        </div>
      </div>
    </Modal>
  );
}
