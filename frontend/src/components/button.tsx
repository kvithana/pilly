import React from 'react'
import { cs } from '../cs'

export function Button({
  type = 'button',
  className,
  children,
  ...rest
}: React.DetailedHTMLProps<React.HTMLProps<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button
      type={type as React.ButtonHTMLAttributes<HTMLButtonElement>['type']}
      className={
        cs(
          'h-16',
          'px-10',
          'rounded-full',
          // 'border-2',
          // 'border-black',
          'font-semibold',
          'text-2xl',
          'bg-brand-secondary',
          'text-brand-primary',
          // 'focus:outline-none',
          // 'focus:shadow-outline',
          // 'active:bg-black',
          // 'active:text-white',
        ) +
        ' ' +
        className
      }
      {...rest}
    >
      {children}
    </button>
  )
}
