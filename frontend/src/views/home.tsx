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
    <div className={cs('rounded-md', 'bg-brand-white', 'py-5', 'px-6', 'text-brand-primary', 'flex')}>
      <div className={cs('w-24', 'h-24', 'mr-4')}>
        <img src="/pills/tablet.png" width="220" height="166" className={cs('w-full', 'h-full', 'object-contain')} />
      </div>
      <div className={cs('flex-grow', 'flex', 'flex-col')}>
        <div className={cs('flex-grow')}>
          <h3 className={cs('font-bold')}>Probiotic, 250mg</h3>
          <span>1 pill, once per day</span>
        </div>
        <div className={cs('flex', 'h-5', 'items-center')}>
          <div className={cs('flex-grow', 'flex', 'items-center')}>
            <i className={cs('fas', 'fa-clock', 'leading-none', 'inline-block', 'h-4')}></i>
            <div className={cs('ml-2')}>
              <span>09:00AM</span>
            </div>
          </div>
          <i className={cs('far', 'fa-bell', 'leading-none', 'inline-block', 'h-4')}></i>
        </div>
      </div>
    </div>
  )
}
