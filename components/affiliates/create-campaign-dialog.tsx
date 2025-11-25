"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { CreateCampaignForm, AdvertisingCampaign, MentorAffiliate } from "@/lib/types/mentor";

interface CreateCampaignDialogProps {
  isOpen: boolean;
  affiliates: MentorAffiliate[];
  onClose: () => void;
  onSuccess: (campaign: AdvertisingCampaign) => void;
}

export function CreateCampaignDialog({ isOpen, affiliates, onClose, onSuccess }: CreateCampaignDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCampaignForm>({
    title: "",
    description: "",
    affiliate_id: undefined,
    campaign_type: "feed",
    target_audience: "all_students",
    priority: 5,
    click_url: "",
    image_url: "",
    headline: "",
    body_text: "",
    call_to_action: "Learn More",
    start_date: "",
    end_date: "",
    budget_limit: undefined,
    daily_cap: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.campaign_type || !formData.target_audience) {
        throw new Error("Please fill in all required fields");
      }

      // Validate priority
      if (formData.priority < 1 || formData.priority > 10) {
        throw new Error("Priority must be between 1 and 10");
      }

      // Validate URL if provided
      if (formData.click_url) {
        try {
          new URL(formData.click_url);
        } catch {
          throw new Error("Please enter a valid click URL");
        }
      }

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create campaign');
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        affiliate_id: undefined,
        campaign_type: "feed",
        target_audience: "all_students",
        priority: 5,
        click_url: "",
        image_url: "",
        headline: "",
        body_text: "",
        call_to_action: "Learn More",
        start_date: "",
        end_date: "",
        budget_limit: undefined,
        daily_cap: undefined
      });

      onSuccess(data.campaign);
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
      setFormData({
        title: "",
        description: "",
        affiliate_id: undefined,
        campaign_type: "feed",
        target_audience: "all_students",
        priority: 5,
        click_url: "",
        image_url: "",
        headline: "",
        body_text: "",
        call_to_action: "Learn More",
        start_date: "",
        end_date: "",
        budget_limit: undefined,
        daily_cap: undefined
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Advertising Campaign</DialogTitle>
          <DialogDescription>
            Promote your affiliate programs to students with targeted advertising
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
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., FTMO Premium Challenge"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority (1-10) *</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 5 }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign_type">Campaign Type *</Label>
              <Select
                value={formData.campaign_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, campaign_type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="feed">Feed</SelectItem>
                  <SelectItem value="modal">Modal</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience *</Label>
              <Select
                value={formData.target_audience}
                onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_students">All Students</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliate_id">Link to Affiliate (Optional)</Label>
            <Select
              value={formData.affiliate_id || "none"}
              onValueChange={(value) => setFormData(prev => ({ ...prev, affiliate_id: value === "none" ? undefined : value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an affiliate program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None - Custom URL</SelectItem>
                {affiliates.map((affiliate) => (
                  <SelectItem key={affiliate.id} value={affiliate.id}>
                    {affiliate.name} - {affiliate.provider_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!formData.affiliate_id && (
            <div className="space-y-2">
              <Label htmlFor="click_url">Click URL</Label>
              <Input
                id="click_url"
                type="url"
                value={formData.click_url}
                onChange={(e) => setFormData(prev => ({ ...prev, click_url: e.target.value }))}
                placeholder="https://your-landing-page.com"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                placeholder="Catchy headline for your ad"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_text">Body Text</Label>
              <Textarea
                id="body_text"
                value={formData.body_text}
                onChange={(e) => setFormData(prev => ({ ...prev, body_text: e.target.value }))}
                placeholder="Ad description text..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="call_to_action">Call to Action</Label>
              <Input
                id="call_to_action"
                value={formData.call_to_action}
                onChange={(e) => setFormData(prev => ({ ...prev, call_to_action: e.target.value }))}
                placeholder="e.g., Start Challenge"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_limit">Budget Limit ($)</Label>
              <Input
                id="budget_limit"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget_limit || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  budget_limit: e.target.value ? parseFloat(e.target.value) : undefined
                }))}
                placeholder="100.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily_cap">Daily Cap ($)</Label>
              <Input
                id="daily_cap"
                type="number"
                min="0"
                step="0.01"
                value={formData.daily_cap || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  daily_cap: e.target.value ? parseFloat(e.target.value) : undefined
                }))}
                placeholder="10.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your campaign goals and strategy..."
              rows={3}
            />
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
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
