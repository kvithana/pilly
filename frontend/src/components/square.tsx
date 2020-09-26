import React from 'react'
import { cs } from '../cs'
import styles from './square.module.css'

export function Square({ className, children, ...rest }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={cs(className, styles.outer)} {...rest}>
      <div className={styles.inner}>{children}</div>
    </div>
  )
}
