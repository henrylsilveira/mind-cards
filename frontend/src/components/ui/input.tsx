import * as React from "react"
import { cn } from "../../libs/utils/tw-merge"


export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-green-900 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-zinc-800",
        className,
      )}
      ref={ref}
      style={{ pointerEvents: "auto", zIndex: 100 }}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
