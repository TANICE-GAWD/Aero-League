import * as React from "react"
import './ui.css'

function Input({
  className = "",
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`input ${className}`.trim()}
      {...props}
    />
  );
}

export { Input }
