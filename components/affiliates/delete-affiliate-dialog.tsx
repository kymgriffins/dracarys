"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { MentorAffiliate } from "@/lib/types/mentor";

interface DeleteAffiliateDialogProps {
  isOpen: boolean;
  affiliate: MentorAffiliate | null;
  onClose: () => void;
  onConfirm: (affiliate: MentorAffiliate) => void;
}

export function DeleteAffiliateDialog({ isOpen, affiliate, onClose, onConfirm }: DeleteAffiliateDialogProps) {
  if (!affiliate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Affiliate
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this affiliate program? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{affiliate.name}</strong> from <strong>{affiliate.provider_name}</strong> will be permanently removed.
            All click and conversion data for this affiliate will be lost.
          </AlertDescription>
        </Alert>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(affiliate)}
          >
            Delete Affiliate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
