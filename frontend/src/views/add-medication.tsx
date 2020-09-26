import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '../components'
import { cs } from '../cs'

export function AddMedication() {
  const history = useHistory<
    { medicationTitle: string; doseFrequencyNumber: number; dosageNumber: number } | undefined
  >()

  useEffect(() => {
    if (!history.location.state?.medicationTitle) {
      history.replace('/scan')
    }
  }, [history.location.state])

  const medicationTitle = history.location.state?.medicationTitle || null
  const doseFrequencyNumber = history.location.state?.doseFrequencyNumber || null
  const dosageNumber = history.location.state?.dosageNumber

  console.log({ medicationTitle, doseFrequencyNumber, dosageNumber })

  return (
    <div className={cs('min-h-screen', 'bg-brand-primary', 'text-brand-white')}>
      <div className={cs('h-full', 'flex', 'flex-col')}>
        <div className={cs('px-5', 'py-5')}>
          <i className={cs('fas', 'fa-chevron-left', 'text-brand-white', 'text-2xl')} />
        </div>

        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'px-5', 'mb-5')}>
          <i className={cs('fas', 'fa-prescription-bottle-alt', 'text-brand-white', 'text-3xl', 'mt-5')} />
          <div className={cs('m-4')} />
          <h1 className={cs('font-semibold', 'flex', 'items-center', 'mb-2', 'text-center')}>
            <span className={cs('text-3xl')}>{medicationTitle}</span>
          </h1>
          <div className={cs('font-thin', 'items-center', 'flex', 'justify-center')}>
            <button className={cs('border-2', 'border-white', 'text-xs', 'py-1', 'px-2', 'rounded-full')}>
              Change medication <i className={cs('fas', 'fa-pen')}></i>
            </button>
          </div>
        </div>

        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'py-3')}>
          <img src="/pills/tablet.png" className={cs('w-24', 'h-24')} />
        </div>
        <div className={cs('px-12', 'mb-5', 'mb-1')}>
          <div>
            <label className={cs('text-sm', 'uppercase', 'tracking-wide', 'font-semibold', 'mb1')}>Dosage</label>
          </div>
          <Select>
            <option value="1">One tablet</option>
            <option value="2">Two tablets</option>
          </Select>
        </div>
        <div className={cs('px-12')}>
          <div>
            <label className={cs('text-sm', 'uppercase', 'tracking-wide', 'font-semibold')}>Schedule</label>
          </div>
          <Select>
            <option value="1">Once a day</option>
            <option value="2">Two times a day</option>
            <option value="3">Three time a day</option>
          </Select>
        </div>
      </div>
      <div className={cs('fixed', 'bottom-0', 'w-screen')}>
        <div className="m-5 mb-10">
          <Button
            className={cs('w-full', 'bg-brand-secondary', 'text-brand-primary')}
            onClick={() => history.push('/home')}
          >
            Add medication
          </Button>
        </div>
      </div>
    </div>
  )
}

function Select({ className, children, ...rest }: React.HTMLProps<HTMLSelectElement>) {
  return (
    <select
      className={cs(
        'appearance-none',
        'border-brand-white',
        'border-2',
        'bg-transparent',
        'text-brand-white',
        'rounded',
        'pl-4',
        'pr-8',
        'py-2',
        'text-lg',
        'font-semibold',
        'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
}
