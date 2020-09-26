import { addDays, format as formatDate } from 'date-fns'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { IconButton } from '../components'
import { cs } from '../cs'

export function Home() {
  const history = useHistory()

  return (
    <div className={cs('bg-brand-secondary', 'text-brand-primary', 'flex', 'flex-col')}>
      <div className={cs('h-16', 'flex', 'items-center', 'mt-8')}>
        <div className={cs('flex-grow', 'pl-5', 'text-xl')}>
          <span className={cs('font-bold')}>{formatDate(new Date(), 'MMMM')}</span> {formatDate(new Date(), 'yyyy')}
        </div>
        <button
          className={cs('inline-flex', 'items-center', 'justify-center', 'h-16', 'w-16')}
          onClick={() => history.push('/account')}
        >
          <i className={cs('fas', 'fa-bell', 'text-2xl')}></i>
        </button>
      </div>
      <div
        className={cs('h-24', 'px-3', 'mb-5', 'max-w-screen', 'overflow-hidden')}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridGap: '0.5rem' }}
      >
        <CalendarDay i={0} />
        <CalendarDay i={1} />
        <CalendarDay i={2} />
        <CalendarDay i={3} />
        <CalendarDay i={4} />
      </div>
      <div className={cs('bg-brand-primary', 'rounded-t-lg', 'text-brand-secondary', 'flex-grow', 'py-6', 'px-6')}>
        <div className={cs('flex', 'justify-between', 'items-center', 'mb-6')}>
          <h2 className={cs('font-bold', 'text-2xl', 'tracking-wide')}>My medication</h2>
          <IconButton className={cs('-mt-1', '-mr-1')} onClick={() => history.push('/scan')}>
            <i className={cs('fas', 'fa-plus')}></i>
          </IconButton>
        </div>
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
          <i className={cs('fas', 'fa-bell', 'leading-none', 'inline-block', 'h-4')}></i>
        </div>
      </div>
    </div>
  )
}

function CalendarDay({ i }: { i: number }) {
  return (
    <div
      className={cs(
        i === 0 ? ['bg-brand-primary', 'text-brand-white'] : null,
        'rounded-md',
        'p-4',
        'text-center',
        'flex',
        'flex-col',
        'justify-around',
      )}
    >
      <span className={cs('font-bold', 'text-lg')}>{formatDate(addDays(new Date(), i), 'dd')}</span>
      <span className={cs('tsxt-sm')}>{formatDate(addDays(new Date(), i), 'EEE')}</span>
    </div>
  )
}
