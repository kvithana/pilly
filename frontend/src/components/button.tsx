import React from 'react'

import { cs } from '../cs'
import styles from './button.module.css'

export function Button({
  type = 'button',
  className,
  children,
  invert,
  pending,
  ...rest
}: { invert?: boolean; pending?: boolean } & React.DetailedHTMLProps<
  React.HTMLProps<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      type={type as React.ButtonHTMLAttributes<HTMLButtonElement>['type']}
      className={cs(
        'h-16',
        'px-10',
        'rounded-full',
        'font-semibold',
        'text-2xl',
        'focus:outline-none',
        'focus:shadow-outline',
        invert
          ? ['text-brand-secondary', 'bg-brand-primary', 'active:text-brand-primary', 'active:bg-brand-secondary']
          : ['bg-brand-secondary', 'text-brand-primary', 'active:bg-brand-primary', 'active:text-brand-secondary'],
        pending ? styles.pending : null,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function IconButton({
  type = 'button',
  className,
  children,
  invert,
  ...rest
}: { invert?: boolean } & React.DetailedHTMLProps<React.HTMLProps<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button
      type={type as React.ButtonHTMLAttributes<HTMLButtonElement>['type']}
      className={
        cs(
          'h-12',
          'w-12',
          'rounded-full',
          'font-semibold',
          'text-2xl',
          'inline-flex',
          'items-center',
          'justify-center',
          'focus:outline-none',
          'focus:shadow-outline',
          invert
            ? ['text-brand-secondary', 'bg-brand-primary', 'active:text-brand-primary', 'active:bg-brand-secondary']
            : ['bg-brand-secondary', 'text-brand-primary', 'active:bg-brand-primary', 'active:text-brand-secondary'],
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
