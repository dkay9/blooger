"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export const HoverCard = (props) => {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
};

export const HoverCardTrigger = (props) => {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
};

export const HoverCardContent = React.forwardRef(({ className = "", align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Portal data-slot="hover-card-portal">
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      data-slot="hover-card-content"
      className={`bg-popover text-popover-foreground z-50 w-64 rounded-md border p-4 shadow-md outline-none
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
        ${className}`}
      {...props}
    />
  </HoverCardPrimitive.Portal>
));

HoverCardContent.displayName = "HoverCardContent";
