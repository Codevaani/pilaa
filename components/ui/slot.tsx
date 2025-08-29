"use client"

import * as React from "react"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return React.cloneElement(children, {
        ...props,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(children.props as any),
        ref,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    }

    if (React.Children.count(children) > 1) {
      React.Children.only(null)
    }

    return null
  }
)

Slot.displayName = "Slot"

export { Slot }
