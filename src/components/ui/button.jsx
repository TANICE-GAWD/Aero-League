import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import './ui.css'

function Button({
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"
  
  const baseClasses = "btn"
  const variantClass = `btn--${variant}`
  const sizeClass = size === "default" ? "btn--default-size" : `btn--${size}`
  
  const buttonClasses = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim()

  return (
    <Comp
      data-slot="button"
      className={buttonClasses}
      {...props}
    />
  );
}

export { Button }
