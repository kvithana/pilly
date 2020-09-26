import React from 'react'
import { cs } from '../cs'

export function Home() {
  return (
    <div className={cs('bg-brand-secondary', 'text-brand-primary', 'flex', 'flex-col')}>
      <div className={cs('h-64')}></div>
      <div className={cs('bg-brand-primary', 'rounded-t-lg', 'text-brand-secondary', 'flex-grow', 'py-8', 'px-6')}>
        <h2 className={cs('font-bold', 'text-2xl', 'tracking-wide', 'mb-6')}>To take</h2>
        <MedicationCard />
      </div>
    </div>
  )
}

function MedicationCard() {
  return (
    <div className={cs('rounded-md', 'bg-brand-white', 'p-6', 'text-brand-primary', 'flex')}>
      <div></div>
      <div className={cs('flex-grow', 'flex', 'flex-col')}>
        <h3 className={cs('font-bold')}>Probiotic, 250mg</h3>
        <span>1 pill, once per day</span>
      </div>
    </div>
  )
}
