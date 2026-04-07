"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "destructive";
    isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Potwierdź",
    cancelLabel = "Anuluj",
    variant = "default",
    isLoading = false,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-xl font-bold"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-xl font-bold ${variant === "destructive" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}`}
                    >
                        {isLoading ? "Przetwarzanie..." : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
