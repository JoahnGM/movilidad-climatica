import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge con la escala del design system (src/app/globals.css). Sin esto, `text-small`
 * se confunde con un color y borra `text-muted` (o al revés) al combinar clases.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "h4", "lead", "body", "small", "caption", "metric"],
      spacing: ["gutter", "section", "block", "stack", "card"],
      radius: ["control", "card"],
      tracking: ["display", "heading", "eyebrow"],
      shadow: ["card", "raised"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
