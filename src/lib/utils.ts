import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * shadcn's class combiner: `clsx` flattens conditionals, `tailwind-merge`
 * resolves conflicting Tailwind utilities so a `className` passed in by a
 * caller always wins over the component's own default.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
