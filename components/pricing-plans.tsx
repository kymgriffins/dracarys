"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export interface PricingFeature {
  text: string;
  included: boolean | 'priority';
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  billing: string;
  commitment?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  iconBg: string;
  icon: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  popular?: boolean;
  scale?: boolean;
}

interface PricingPlansProps {
  tiers: PricingTier[];
  showTable?: boolean;
  tableFeatures?: string[];
  tableData?: { [key: string]: (boolean | 'priority' | string)[] };
}

export function PricingPlans({
  tiers,
  showTable = true,
  tableFeatures = [],
  tableData = {}
}: PricingPlansProps) {
  const renderedTiers = tiers.map((tier, index) => {
    const isMostPopular = tier.popular || false;

    return (
      <Card
        key={tier.id}
        className={`border-2 ${isMostPopular ? 'border-primary shadow-2xl scale-105 relative' : ''}`}
      >
        {tier.badge && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className={`px-4 py-1 ${tier.badgeVariant === 'default' ? 'bg-foreground text-background' : ''}`}>
              {tier.badge}
            </Badge>
          </div>
        )}

        <CardHeader className={`text-center ${tier.badge ? 'pt-8' : 'pb-8'}`}>
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">{tier.icon}</span>
          </div>
          <CardTitle className="text-2xl">{tier.name}</CardTitle>
          <CardDescription className="text-base">{tier.description}</CardDescription>
          <div className="text-4xl font-bold mt-4">
            ${tier.price}
            <span className="text-lg font-normal text-muted-foreground">{tier.billing}</span>
          </div>
          {tier.commitment && (
            <div className="text-sm text-muted-foreground mt-1">{tier.commitment}</div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            {tier.features.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center space-x-2">
                {feature.included === true && (
                  <Check className="w-5 h-5" />
                )}
                {feature.included === 'priority' && (
                  <span className="text-sm font-medium text-primary">Priority</span>
                )}
                {typeof feature.included === 'string' && feature.included !== 'priority' && (
                  <span className="text-sm">{feature.included}</span>
                )}
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <Link href="/auth/sign-up">
            <Button
              className="w-full"
              variant={tier.buttonVariant || 'default'}
              size="lg"
            >
              {tier.buttonText}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  });

  return (
    <div className="space-y-16">
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {renderedTiers}
      </div>

      {showTable && tableFeatures.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Membership Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-semibold">Features</th>
                  {tiers.map((tier) => (
                    <th key={tier.id} className="p-4 text-center font-semibold">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableFeatures.map((feature, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4 font-medium">{feature}</td>
                    {tiers.map((tier) => {
                      const tierData = tableData[feature];
                      if (!tierData) return <td key={tier.id} className="p-4 text-center">❌</td>;

                      const value = tierData[tiers.findIndex(t => t.id === tier.id)];

                      if (value === true) {
                        return (
                          <td key={tier.id} className="p-4 text-center">
                            <Check className="w-5 h-5 text-primary mx-auto" />
                          </td>
                        );
                      }

                      if (value === 'priority') {
                        return <td key={tier.id} className="p-4 text-center">Priority</td>;
                      }

                      if (typeof value === 'string') {
                        return <td key={tier.id} className="p-4 text-center">{value}</td>;
                      }

                      return <td key={tier.id} className="p-4 text-center">❌</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
