import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react"

import { cn } from "@/shared/utils"

const ToastProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Provider>) => (
  <ToastPrimitives.Provider {...props}>
    {children}
    {/* Screen reader announcement for toast changes */}
    <div
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      Toast notifications will be announced here
    </div>
  </ToastPrimitives.Provider>
)

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-2xl transition-all backdrop-blur-md duration-300 ease-in-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=open]:duration-500 data-[state=closed]:duration-300",
  {
    variants: {
      variant: {
        default: "border-border/50 bg-card/95 text-card-foreground hover:bg-card/98 hover:border-border/80 hover:shadow-2xl",
        destructive:
          "border-red-500/50 bg-red-950/95 text-red-50 hover:bg-red-950/98 hover:border-red-400/60 hover:shadow-red-500/20",
        success: "border-green-500/50 bg-green-950/95 text-green-50 hover:bg-green-950/98 hover:border-green-400/60 hover:shadow-green-500/20",
        warning: "border-yellow-500/50 bg-yellow-950/95 text-yellow-50 hover:bg-yellow-950/98 hover:border-yellow-400/60 hover:shadow-yellow-500/20",
        info: "border-blue-500/50 bg-blue-950/95 text-blue-50 hover:bg-blue-950/98 hover:border-blue-400/60 hover:shadow-blue-500/20",
        loading: "border-blue-500/50 bg-blue-950/95 text-blue-50 hover:bg-blue-950/98 hover:border-blue-400/60 hover:shadow-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: VariantProps<typeof toastVariants>["variant"]
  }
>(({ className, variant, ...props }, ref) => {
  const iconMap = {
    default: null,
    destructive: <AlertCircle className="h-5 w-5 text-red-400" />,
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
    loading: <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />,
  }

  const icon = variant ? iconMap[variant] : null

  if (!icon) return null

  return (
    <div ref={ref} className={cn("flex-shrink-0", className)} {...props}>
      {icon}
    </div>
  )
})
ToastIcon.displayName = "ToastIcon"

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground/70 opacity-0 transition-all duration-200 hover:text-foreground hover:bg-muted/80 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring/50 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:hover:bg-red-900/60 group-[.success]:text-green-300 group-[.success]:hover:text-green-50 group-[.success]:hover:bg-green-900/60 group-[.warning]:text-yellow-300 group-[.warning]:hover:text-yellow-50 group-[.warning]:hover:bg-yellow-900/60 group-[.info]:text-blue-300 group-[.info]:hover:text-blue-50 group-[.info]:hover:bg-blue-900/60 group-[.loading]:text-blue-300 group-[.loading]:hover:text-blue-50 group-[.loading]:hover:bg-blue-900/60",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold text-foreground", className)}
    role="status"
    aria-live="polite"
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
}
