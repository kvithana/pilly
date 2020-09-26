import React, { useEffect, useState, useContext } from 'react'
import { Button } from '../components'
import { cs } from '../cs'
import { useParams, useHistory } from 'react-router-dom'
import { firestore } from '../firebase'
import { AuthContext } from '../contexts/AuthContext'

export const ReminderView = () => {
  const { medication } = useParams()
  const { currentUser } = useContext(AuthContext)
  const history = useHistory()
  const [medicationData, setMedicationData] = useState<UserMedicationData | null>(null)

  useEffect(() => {
    if (!medication) {
      history.push('/home')
    } else {
      if (currentUser) {
        firestore
          .doc(`users/${currentUser.uid}/medications/${medication}`)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log('no exist')
              history.push('/home')
              return
            }
            const data = doc.data() as UserMedicationData
            console.log(data)
            setMedicationData(data)
          })
      }
    }
  }, [medication, currentUser])

  if (!medicationData) {
    return (
      <div className={cs('min-h-screen', 'bg-brand-primary')}>
        <div className={cs('h-full', 'flex', 'flex-col')}>
          <div className={cs('px-5', 'py-5')} onClick={() => history.push('/home')}>
            <i className={cs('fas', 'fa-chevron-left', 'text-brand-white', 'text-2xl')} />
          </div>

          <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'pb-8')}>
            <i className={cs('fas', 'fa-bell', 'text-brand-white', 'text-3xl', 'mt-5')} />
            <div className={cs('m-4')} />
            <span className={cs('text-3xl', 'font-semibold', 'h-10', 'w-64', 'bg-blue-800', 'rounded-sm')}></span>
            <span className={cs('h-4', 'w-24', 'bg-blue-800', 'rounded-sm', 'mt-2')}></span>
          </div>

          <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'py-3')}>
            <img src="/pills/tablet.png" className={cs('w-24', 'h-24')} />
          </div>
          <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'py-6')}>
            <span
              className={cs('h-12', 'w-56', 'bg-blue-800', 'rounded-sm', 'mt-2')}
              style={{ letterSpacing: '0.1em' }}
            ></span>
          </div>
          {/* <div className={cs('w-full', 'flex', 'text-brand-white', 'py-8', 'px-6')}>
            <div className={cs('text-4xl', 'font-bold', '-mt-2')}>
              <i className={cs('fas', 'fa-info-circle', 'text-brand-white', 'text-3xl', 'mr-4')} />
            </div>
            <div className={cs()}>
              <p className={cs('font-bold')}>Description</p>
              <p className={cs('font-thin')} style={{ lineHeight: '1.5em' }}>
                Arosha big boy this is a very good medication. If you are feeling sad boy take this medication it is
                very nice.
              </p>
            </div>
          </div> */}
        </div>
        <div className={cs('fixed', 'bottom-0', 'w-screen')}>
          <div className="m-5 mb-10">
            <Button className={cs('w-full', 'bg-brand-secondary', 'text-brand-primary')}>I took the medication</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cs('min-h-screen', 'bg-brand-primary')}>
      <div className={cs('h-full', 'flex', 'flex-col')}>
        <div className={cs('px-5', 'py-5')}>
          <i className={cs('fas', 'fa-chevron-left', 'text-brand-white', 'text-2xl')} />
        </div>

        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'pb-8', 'px-6')}>
          <i className={cs('fas', 'fa-bell', 'text-brand-white', 'text-3xl', 'mt-5')} />
          <div className={cs('m-4')} />
          <span className={cs('text-3xl', 'font-semibold', 'text-center')}>{medicationData.title}</span>
          <span className={cs('font-thin')}>
            {medicationData.dosage} pill{medicationData.dosage === 1 ? '' : 's'},{' '}
            {(() => {
              switch (medicationData.frequency) {
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
            })()}{' '}
            per day
          </span>
        </div>

        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'py-3')}>
          <img src="/pills/tablet.png" className={cs('w-24', 'h-24')} />
        </div>
        <div className={cs('w-full', 'flex', 'items-center', 'flex-col', 'text-brand-white', 'py-6', 'pb-4')}>
          <span className={cs('text-4xl', 'font-bold')} style={{ letterSpacing: '0.1em' }}>
            {new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours()}:00{' '}
            {new Date().getHours() > 12 ? 'PM' : 'AM'}
          </span>
        </div>
        {medicationData.text && medicationData.text.toLowerCase().includes('drowsiness') ? (
          <div className={cs('w-full', 'flex', 'text-yellow-500', 'py-4', 'px-6')}>
            <div className={cs('text-4xl', 'font-bold', '-mt-2')}>
              <i className={cs('fas', 'fa-exclamation-triangle', 'text-yellow-500', 'text-3xl', 'mr-4')} />
            </div>
            <div className={cs()}>
              <p className={cs('font-bold')}>Warning</p>
              <p className={cs('font-thin')} style={{ lineHeight: '1.5em' }}>
                This medication may cause <strong>drowsiness</strong> and may increase the effects of alcohol. If
                affected, do not drive a motor vehicle or operate machinery.
              </p>
            </div>
          </div>
        ) : null}
        {medicationData.text && medicationData.text.toLowerCase().includes('alertness') ? (
          <div className={cs('w-full', 'flex', 'text-yellow-500', 'py-4', 'px-6')}>
            <div className={cs('text-4xl', 'font-bold', '-mt-2')}>
              <i className={cs('fas', 'fa-exclamation-triangle', 'text-yellow-500', 'text-3xl', 'mr-4')} />
            </div>
            <div className={cs()}>
              <p className={cs('font-bold')}>Warning</p>
              <p className={cs('font-thin')} style={{ lineHeight: '1.5em' }}>
                This medicine may affect <strong>mental alertness</strong> and/or co-ordination. If affected, do not
                drive a motor vehicle or operate machinery.
              </p>
            </div>
          </div>
        ) : null}
        {medicationData.text && medicationData.text.toLowerCase().includes('grapefruit') ? (
          <div className={cs('w-full', 'flex', 'text-green-300', 'py-4', 'px-6')}>
            <div className={cs('text-4xl', 'font-bold', '-mt-2')}>
              <i className={cs('fas', 'fa-info-circle', 'text-green-300', 'text-3xl', 'mr-4')} />
            </div>
            <div className={cs()}>
              <p className={cs('font-bold')}>Info</p>
              <p className={cs('font-thin')} style={{ lineHeight: '1.5em' }}>
                Avoid eating <strong>grapefruit</strong> or <strong>drinking grapefruit juice</strong> while being
                treated with this medicine.
              </p>
            </div>
          </div>
        ) : null}
        <div className={cs('w-full', 'flex', 'text-brand-white', 'py-4', 'px-6', 'mb-40')}>
          <div className={cs('text-4xl', 'font-bold', '-mt-2')}>
            <i className={cs('fas', 'fa-info-circle', 'text-brand-white', 'text-3xl', 'mr-4')} />
          </div>
          <div className={cs()}>
            <p className={cs('font-bold')}>Medicine Information</p>
            <p className={cs('font-thin')} style={{ lineHeight: '1.5em' }}>
              We don&apos;t have deep insights on this medication yet, but we have added it to our list. Check back
              later to view more information on side effects, usage instructions and more.
            </p>
          </div>
        </div>
      </div>
      <div className="fixed w-screen h-48 bottom-0 bg-gradient-to-b from-transparent to-brand-primary rounded-b-lg" />

      <div className={cs('fixed', 'bottom-0', 'w-screen')}>
        <div className="m-5 mb-10">
          <Button
            onClick={() => history.push('/home')}
            className={cs('w-full', 'bg-brand-secondary', 'text-brand-primary')}
          >
            I took the medication
          </Button>
        </div>
      </div>
    </div>
  )
}
