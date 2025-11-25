"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { MentorAffiliate } from "@/lib/types/mentor";

interface EditAffiliateDialogProps {
  isOpen: boolean;
  affiliate: MentorAffiliate | null;
  onClose: () => void;
  onSuccess: (affiliate: MentorAffiliate) => void;
}

export function EditAffiliateDialog({ isOpen, affiliate, onClose, onSuccess }: EditAffiliateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    provider_type: "prop_firm" as MentorAffiliate['provider_type'],
    provider_name: "",
    affiliate_url: "",
    commission_rate: undefined as number | undefined,
    description: "",
    is_active: true
  });

  // Update form data when affiliate changes
  useEffect(() => {
    if (affiliate) {
      setFormData({
        name: affiliate.name,
        provider_type: affiliate.provider_type,
        provider_name: affiliate.provider_name,
        affiliate_url: affiliate.affiliate_url,
        commission_rate: affiliate.commission_rate,
        description: affiliate.description || "",
        is_active: affiliate.is_active
      });
    }
  }, [affiliate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate) return;

    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.provider_name.trim() || !formData.affiliate_url.trim()) {
        throw new Error("Please fill in all required fields");
      }

      // Validate URL
      try {
        new URL(formData.affiliate_url);
      } catch {
        throw new Error("Please enter a valid URL");
      }

      // Validate commission rate
      if (formData.commission_rate !== undefined && (formData.commission_rate < 0 || formData.commission_rate > 100)) {
        throw new Error("Commission rate must be between 0 and 100");
      }

      const response = await fetch(`/api/affiliates/${affiliate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update affiliate');
      }

      onSuccess(data.affiliate);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!affiliate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Affiliate</DialogTitle>
          <DialogDescription>
            Update your affiliate program details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Affiliate Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., FTMO Premium Account"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider_type">Provider Type *</Label>
              <Select
                value={formData.provider_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, provider_type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prop_firm">Prop Firm</SelectItem>
                  <SelectItem value="broker">Broker</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider_name">Provider Name *</Label>
              <Input
                id="provider_name"
                value={formData.provider_name}
                onChange={(e) => setFormData(prev => ({ ...prev, provider_name: e.target.value }))}
                placeholder="e.g., FTMO"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission_rate">Commission Rate (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.commission_rate || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  commission_rate: e.target.value ? parseFloat(e.target.value) : undefined
                }))}
                placeholder="e.g., 5.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliate_url">Affiliate URL *</Label>
            <Input
              id="affiliate_url"
              type="url"
              value={formData.affiliate_url}
              onChange={(e) => setFormData(prev => ({ ...prev, affiliate_url: e.target.value }))}
              placeholder="https://your-affiliate-link.com/ref/..."
              required
            />
            <p className="text-sm text-muted-foreground">
              Your unique affiliate tracking link
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this affiliate opportunity..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active affiliate program</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Affiliate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
