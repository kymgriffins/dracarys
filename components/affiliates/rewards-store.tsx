"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Gift,
  Crown,
  Star,
  Zap,
  Percent,
  Shield,
  Trophy,
  Coins,
  Sparkles,
  Lock,
  CheckCircle,
  ShoppingCart,
  CreditCard,
  Tag,
  Award,
  Diamond
} from "lucide-react";
import { Reward } from "@/lib/types/affiliate-points";

interface RewardsStoreProps {
  availableRewards: Reward[];
  userPoints: number;
  claimedRewards: string[];
  onClaimReward: (rewardId: string) => void;
  onRedeemDiscount: (rewardId: string, code?: string) => void;
}

export function RewardsStore({
  availableRewards,
  userPoints,
  claimedRewards,
  onClaimReward,
  onRedeemDiscount
}: RewardsStoreProps) {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const getRewardIcon = (type: Reward['type']) => {
    switch (type) {
      case 'discount': return Percent;
      case 'feature': return Crown;
      case 'badge': return Award;
      case 'priority': return Star;
      case 'exclusive': return Diamond;
      default: return Gift;
    }
  };

  const getRewardColor = (type: Reward['type']) => {
    switch (type) {
      case 'discount': return 'text-green-600 bg-green-50 border-green-200';
      case 'feature': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'badge': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'priority': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'exclusive': return 'text-pink-600 bg-pink-50 border-pink-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (reward.type === 'discount' && discountCode.trim()) {
      setIsRedeeming(true);
      await onRedeemDiscount(reward.id, discountCode);
      setIsRedeeming(false);
      setSelectedReward(null);
      setDiscountCode('');
    } else {
      await onClaimReward(reward.id);
      setSelectedReward(null);
    }
  };

  const isRewardClaimed = (rewardId: string) => claimedRewards.includes(rewardId);

  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Points Balance
              </h2>
              <p className="text-muted-foreground">Redeem points for exclusive rewards</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{userPoints.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Available Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableRewards.map((reward) => {
          const IconComponent = getRewardIcon(reward.type);
          const isClaimed = isRewardClaimed(reward.id);
          const canAfford = userPoints >= reward.points_cost;
          const isAvailable = reward.available && (!reward.max_claims || reward.claims_count < reward.max_claims);

          return (
            <Card
              key={reward.id}
              className={`hover:shadow-lg transition-all duration-200 ${
                isClaimed ? 'opacity-60' : ''
              } ${getRewardColor(reward.type)}`}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/80 mb-3">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="font-bold text-lg">{reward.points_cost}</span>
                    <span className="text-sm text-muted-foreground">points</span>
                  </div>
                  {reward.value && (
                    <Badge variant="outline" className="mb-3">
                      {reward.type === 'discount' ? `${reward.value}% off` :
                       reward.type === 'feature' ? `${reward.value} days` :
                       `Value: ${reward.value}`}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  {!isAvailable && (
                    <div className="text-center text-sm text-red-600 font-medium">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Temporarily Unavailable
                    </div>
                  )}

                  {reward.max_claims && (
                    <div className="text-center text-sm text-muted-foreground">
                      {reward.claims_count}/{reward.max_claims} claimed
                    </div>
                  )}

                  {isClaimed ? (
                    <Button disabled className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Claimed
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          disabled={!canAfford || !isAvailable}
                          variant={canAfford && isAvailable ? "default" : "outline"}
                        >
                          {canAfford && isAvailable ? (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Redeem
                            </>
                          ) : !canAfford ? (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Need {reward.points_cost - userPoints} more points
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Unavailable
                            </>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5" />
                            Confirm Redemption
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure you want to redeem "{reward.name}" for {reward.points_cost} points?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">{reward.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Coins className="w-4 h-4 text-yellow-600" />
                              <span>Cost: {reward.points_cost} points</span>
                            </div>
                          </div>

                          {reward.type === 'discount' && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Discount Code (optional)
                              </label>
                              <Input
                                placeholder="Enter discount code"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Leave empty for automatic code generation
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => handleRedeem(reward)}
                              disabled={isRedeeming}
                            >
                              {isRedeeming ? (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                  Redeeming...
                                </>
                              ) : (
                                <>
                                  <Gift className="w-4 h-4 mr-2" />
                                  Confirm Redemption
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Special Rewards Section */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            Exclusive Rewards
          </CardTitle>
          <CardDescription>
            Special rewards unlocked at higher point thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/60 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-8 h-8 text-yellow-600" />
                <div>
                  <h3 className="font-semibold">VIP Status</h3>
                  <p className="text-sm text-muted-foreground">5,000 points required</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Get priority support, exclusive content access, and monthly bonus points.
              </p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div>
                  <h3 className="font-semibold">Mentorship Session</h3>
                  <p className="text-sm text-muted-foreground">10,000 points required</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                One-on-one trading mentorship session with personalized strategies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
