import React from 'react'
import { Button } from '../components'
import { cs } from '../cs'

export const ReminderView = () => {
  return (
    <div className={cs('min-h-screen', 'bg-brand-primary')}>
      <div className={cs('h-full', 'p-5', 'flex', 'flex-col')}>
        <div>
          <i className={cs('fas', 'fa-chevron-left', 'text-brand-white', 'text-2xl', 'mt-10')} />
        </div>

        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'pb-8')}>
          <i className={cs('fas', 'fa-bell', 'text-brand-white', 'text-3xl', 'mt-5')} />
          <div className={cs('m-4')} />
          <span className={cs('text-2xl', 'font-semibold')}>Loratadine, 10mg</span>
          <span className={cs('font-thin')}>1 pill, once per day</span>
        </div>

        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'py-3')}>
          <img src="/pills/tablet.png" className={cs('transform scale-75')} />
        </div>
        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'py-6')}>
          <span className={cs('text-4xl', 'font-bold')} style={{ letterSpacing: '0.1em' }}>
            08:00 AM
          </span>
        </div>
        <div className={cs('w-full', 'flex', 'text-brand-white', 'py-8')}>
          <div className={cs('text-4xl', 'font-bold', '-mt-2')}>
            <i className={cs('fas', 'fa-info-circle', 'text-brand-white', 'text-3xl', 'mr-4')} />
          </div>
          <div className={cs()}>
            <p className={cs('font-bold')}>Description</p>
            <p className={cs('font-thin')} style={{ lineHeight: '1.5em' }}>
              Arosha big boy this is a very good medication. If you are feeling sad boy take this medication it is very
              nice.
            </p>
          </div>
        </div>
      </div>
      <div className={cs('fixed', 'bottom-0', 'w-screen')}>
        <div className="m-5 mb-10">
          <Button className={cs('w-full', 'bg-brand-secondary', 'text-brand-primary')}>I took the medication</Button>
        </div>
      </div>
    </div>
  )
}
