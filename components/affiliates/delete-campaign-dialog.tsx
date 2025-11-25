"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { AdvertisingCampaign } from "@/lib/types/mentor";

interface DeleteCampaignDialogProps {
  isOpen: boolean;
  campaign: AdvertisingCampaign | null;
  onClose: () => void;
  onConfirm: (campaign: AdvertisingCampaign) => void;
}

export function DeleteCampaignDialog({ isOpen, campaign, onClose, onConfirm }: DeleteCampaignDialogProps) {
  if (!campaign) return null;

  const canDelete = campaign.status !== 'active';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Campaign
          </DialogTitle>
          <DialogDescription>
            {canDelete
              ? "Are you sure you want to delete this campaign? This action cannot be undone."
              : "This campaign is currently active and cannot be deleted."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{campaign.title}</h4>
              <p className="text-sm text-muted-foreground">{campaign.description}</p>
            </div>
            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
              {campaign.status}
            </Badge>
          </div>

          {!canDelete && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Active campaigns cannot be deleted. Please pause the campaign first by editing its status.
              </AlertDescription>
            </Alert>
          )}

          {canDelete && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{campaign.title}</strong> and all its performance data will be permanently removed.
                This includes impressions, clicks, and conversion statistics.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!canDelete}
            onClick={() => canDelete && onConfirm(campaign)}
          >
            {canDelete ? 'Delete Campaign' : 'Cannot Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
