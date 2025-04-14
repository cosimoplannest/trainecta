
import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export interface SidebarSeparatorProps extends React.ComponentProps<typeof Separator> {}

export const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  SidebarSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})

SidebarSeparator.displayName = "SidebarSeparator"
