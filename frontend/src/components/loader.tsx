import React from 'react'
import styles from './loader.module.css'

const colors = {
  'brand-primary': '#0021ac',
  'brand-primary-light': '#4c62c2',
  'brand-white': '#feffff',
  'brand-secondary': '#fce2ed',
  'brand-secondary-alt': '#ffd6dd',
  'brand-red': '#e7576b',
  'up-blue-gray': '#1a1a22',
}

export function Loader({ color }: { color?: keyof typeof colors }) {
  return (
    // @ts-ignore
    <div className={styles.spinner} style={{ '--spinner-color': colors[color] || 'white' }}>
      <div />
    </div>
  )
}
