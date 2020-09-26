import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '../components'
import { cs } from '../cs'
import { toast } from 'react-toastify'
import { AuthContext } from '../contexts/AuthContext'
import { firestore } from '../firebase'

export function AddMedication() {
  const history = useHistory<
    { medicationTitle: string; doseFrequencyNumber: number; dosageNumber: number; text: string } | undefined
  >()
  const [dosage, setDosage] = useState(history.location.state?.dosageNumber || 1)
  const [schedule, setSchedule] = useState(history.location.state?.doseFrequencyNumber || 1)
  const [medicationTitle, setMedicationTitle] = useState(history.location.state?.medicationTitle || '')
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const niceText = (s: string) => {
    const splitted = s.split(' ')
    const nice = splitted.map((t) => t.slice(0, 1).toUpperCase() + t.slice(1).toLowerCase())
    return nice.join(' ')
  }

  useEffect(() => {
    if (!history.location.state?.medicationTitle) {
      history.replace('/scan')
    }
  }, [history.location.state])

  const onChangeMedicationClick = () => {
    toast('Not implemented yet 😭')
  }

  const onDosageChange = (e: React.FormEvent<HTMLSelectElement>) => {
    //@ts-ignore
    setDosage(e.target.value)
  }

  const onScheduleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    //@ts-ignore
    setSchedule(e.target.value)
  }

  const onAddMedication = () => {
    let times: string[] = []
    switch (schedule) {
      case 1:
        times = ['9000']
        break
      case 2:
        times = ['9000', '1800']
        break

      case 3:
        times = ['9000', '1300', '1800']
        break

      case 4:
        times = ['9000', '1300', '1800', '2100']
        break
      default:
        break
    }
    if (currentUser) {
      firestore
        .collection(`users/${currentUser.uid}/medications/`)
        .add({
          frequency: schedule,
          dosage,
          title: niceText(medicationTitle),
          notificationsEnabled: true,
          notificationTimes: times,
          text: history.location.state?.text || '',
        } as UserMedicationData)
        .then(() => history.push('/home'))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false))
    }
  }

  const goBack = () => {
    history.push('/scan')
  }

  return (
    <div className={cs('min-h-screen', 'bg-brand-primary', 'text-brand-white')}>
      <div className={cs('h-full', 'flex', 'flex-col')}>
        <div>
          <button className={cs('h-16', 'w-16', 'inline-flex', 'items-center', 'justify-center')} onClick={goBack}>
            <i className={cs('fas', 'fa-chevron-left', 'text-brand-white', 'text-2xl')} />
          </button>
        </div>

        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'px-5', 'mb-5')}>
          <i className={cs('fas', 'fa-prescription-bottle-alt', 'text-brand-white', 'text-3xl', 'mt-5')} />
          <div className={cs('m-4')} />
          <h1 className={cs('font-semibold', 'flex', 'items-center', 'mb-2', 'text-center')}>
            <span className={cs('text-3xl')}>{medicationTitle}</span>
          </h1>
          <div className={cs('font-thin', 'items-center', 'flex', 'justify-center')}>
            <button
              onClick={onChangeMedicationClick}
              className={cs('border-2', 'border-white', 'text-xs', 'py-1', 'px-2', 'rounded-full')}
            >
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
          <Select className={cs('text-brand-primary')} onChange={onDosageChange} value={dosage}>
            <option value="1">One tablet</option>
            <option value="2">Two tablets</option>
            <option value="3">Three tablets</option>
            <option value="4">Four tablets</option>
          </Select>
        </div>
        <div className={cs('px-12')}>
          <div>
            <label className={cs('text-sm', 'uppercase', 'tracking-wide', 'font-semibold')}>Schedule</label>
          </div>
          <Select onChange={onScheduleChange} value={schedule}>
            <option value="1">Once a day</option>
            <option value="2">Two times a day</option>
            <option value="3">Three time a day</option>
            <option value="4">Four time a day</option>
          </Select>
        </div>
      </div>
      <div className={cs('fixed', 'bottom-0', 'w-screen')}>
        <div className="m-5 mb-10">
          <Button
            className={cs('w-full', 'bg-brand-secondary', 'text-brand-primary')}
            onClick={onAddMedication}
            pending={loading}
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
