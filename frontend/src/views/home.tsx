import { addDays, format as formatDate } from 'date-fns'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { IconButton } from '../components'
import { cs } from '../cs'
import { AuthContext } from '../contexts/AuthContext'
import { firestore } from '../firebase'
import { orderBy } from 'lodash'

interface UserMedicationListItem extends UserMedicationData {
  time: Date
}

export function Home() {
  const history = useHistory()
  const { currentUser } = useContext(AuthContext)
  const [medications, setMedications] = useState<UserMedicationData[]>([])
  const [upcoming, setUpcoming] = useState<UserMedicationListItem[]>([])
  const [complete, setComplete] = useState<UserMedicationListItem[]>([])

  useEffect(() => {
    if (medications.length) {
      const withTimes = medications
        .map((m) => {
          return m.notificationTimes.map((t) => {
            const d = new Date()
            d.setHours(parseInt(t.slice(0, 2)))
            d.setMinutes(parseInt(t.slice(2)))
            return {
              ...m,
              time: d,
              text: `${m.dosage} pill${m.dosage === 1 ? '' : 's'},${' '}
            ${(() => {
              switch (m.frequency) {
                case 1:
                  return 'once'
                case 2:
                  return 'twice'
                case 3:
                  return 'three times'
                case 4:
                  return 'four times'
                default:
                  return ''
              }
            })()} a day`,
            }
          })
        })
        .flat()
      const orderedEvents: UserMedicationListItem[] = orderBy(withTimes, ['time', 'title'], ['asc', 'asc'])
      setUpcoming(orderedEvents.filter((e) => new Date() < e.time))
      setComplete(orderedEvents.filter((e) => new Date() > e.time).reverse())
    }
  }, [medications])

  useEffect(() => {
    if (currentUser) {
      firestore
        .collection(`users/${currentUser.uid}/medications`)
        .get()
        .then((res) => setMedications(res.docs.map((d) => d.data() as UserMedicationData)))
        .catch((e) => console.error(e))
    }
  }, [currentUser])

  return (
    <div className={cs('bg-brand-secondary', 'text-brand-primary', 'flex', 'flex-col')}>
      <div className={cs('h-16', 'flex', 'items-center')}>
        <div className={cs('flex-grow')}></div>
        <button
          className={cs('inline-flex', 'items-center', 'justify-center', 'h-16', 'w-16')}
          onClick={() => history.push('/account')}
        >
          <i className={cs('fas', 'fa-bell', 'text-2xl')}></i>
        </button>
      </div>
      <div className={cs('h-16', 'flex', 'items-center')}>
        <div className={cs('flex-grow', 'pl-5', 'text-xl')}>
          <span className={cs('font-bold')}>{formatDate(new Date(), 'MMMM')}</span> {formatDate(new Date(), 'yyyy')}
        </div>
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
        {upcoming.map((m, i) => (
          <MedicationCard
            key={`upcoming-${i}`}
            title={m.title}
            detail={m.text || ''}
            dosage={m.dosage}
            time={formatDate(m.time, 'h:mm a')}
          />
        ))}
        {complete.length ? <div className="separator mt-2 mb-5">Earlier Today</div> : null}
        {complete.map((m, i) => (
          <MedicationCard
            key={`upcoming-${i}`}
            title={m.title}
            detail={m.text || ''}
            dosage={m.dosage}
            time={formatDate(m.time, 'h:mm a')}
            muted={true}
          />
        ))}
      </div>
    </div>
  )
}

function MedicationCard({
  title,
  detail,
  time,
  dosage,
  muted,
}: {
  key: string
  title: string
  detail: string
  time: string
  dosage: number
  muted?: boolean
}) {
  return (
    <div
      className={cs(
        'rounded-md',
        'bg-brand-white',
        'py-5',
        'px-6',
        'text-brand-primary',
        'flex',
        'mb-3',
        muted ? ['opacity-50'] : [],
      )}
    >
      <div className={cs('w-24', 'h-24', 'mr-4')}>
        <img src={`/pills/tablet-${dosage}.png`} className={cs('w-full', 'h-full', 'object-contain')} />
      </div>
      <div className={cs('flex-grow', 'flex', 'flex-col')}>
        <div className={cs('flex-grow')}>
          <h3 className={cs('font-bold')}>{title}</h3>
          <span>{detail}</span>
        </div>
        <div className={cs('flex', 'h-5', 'items-center')}>
          <div className={cs('flex-grow', 'flex', 'items-center')}>
            <i className={cs('fas', 'fa-clock', 'leading-none', 'inline-block', 'h-4')}></i>
            <div className={cs('ml-2')}>
              <span>{time}</span>
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
