"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface GlassCardProps extends React.ComponentProps<typeof Card> {
  hoverEffect?: boolean;
  delay?: number;
}

export function GlassCard({
  className,
  children,
  hoverEffect = true,
  delay = 0,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        className={cn(
          "glass border-0 h-full",
          hoverEffect && "glass-hover hover:-translate-y-1 transition-transform duration-300",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}

export function GlassCardHeader({ className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("", className)} {...props} />;
}

export function GlassCardTitle({ className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle className={cn("text-gradient font-bold", className)} {...props} />;
}

export function GlassCardDescription({ className, ...props }: React.ComponentProps<typeof CardDescription>) {
  return <CardDescription className={cn("text-muted-foreground/80", className)} {...props} />;
}

export function GlassCardContent({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("", className)} {...props} />;
}

export function GlassCardFooter({ className, ...props }: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter className={cn("", className)} {...props} />;
}
