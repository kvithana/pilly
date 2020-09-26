import * as clipboardy from 'clipboardy'
import { nanoid } from 'nanoid'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Button } from '../components/button'
import { Square } from '../components/square'
import { cs } from '../cs'
import { functions, storage } from '../firebase'
import styles from './scan.module.css'

class PhotoCapturer {
  video: HTMLVideoElement
  canvas: HTMLCanvasElement
  rafId = -1
  playing = false
  size = 0
  stream: MediaStream | undefined
  paused = false

  constructor(canvas: HTMLCanvasElement) {
    this.video = document.createElement('video')
    this.canvas = canvas
  }

  async start() {
    // acquire media stream
    const constraints = { audio: false, video: { facingMode: 'environment' } }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    this.stream = stream
    // link the stream to the video element
    this.video.srcObject = stream
    await new Promise((resolve) => (this.video.onloadedmetadata = resolve))
    // set up the canvas
    this.size = Math.min(this.video.videoHeight, this.video.videoWidth)
    this.canvas.width = this.size
    this.canvas.height = this.size
    // wait for the camera stream to start then play
    await new Promise((resolve) => (this.video.onloadeddata = resolve))
    this.play()
  }

  update() {
    if (!this.playing) return
    const ctx = this.canvas.getContext('2d')!
    const offsetX = 0.5 * (this.video.videoWidth - this.size)
    const offsetY = 0.5 * (this.video.videoHeight - this.size)
    ctx.drawImage(this.video, -offsetX, -offsetY, this.video.videoWidth, this.video.videoHeight)
    this.rafId = requestAnimationFrame(() => this.update())
  }

  capture(mimeType = 'image/jpeg', quality?: number): Promise<Blob> {
    return new Promise((resolve) => this.canvas.toBlob((blob) => resolve(blob!), mimeType, quality))
  }

  play() {
    this.video.play()
    this.playing = true
    this.update()
  }

  pause() {
    cancelAnimationFrame(this.rafId)
    this.video.pause()
    this.playing = false
  }

  stop() {
    this.pause()
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
    }
  }
}

export function ScanView() {
  const history = useHistory()
  const canvas = useRef<HTMLCanvasElement>(null!)
  const capturer = useRef<PhotoCapturer>(null!)
  const [permission, setPermission] = useState<PermissionState | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    capturer.current = new PhotoCapturer(canvas.current)

    if (navigator?.permissions?.query) {
      navigator.permissions.query({ name: 'camera' }).then((result) => {
        setPermission(result.state)
        if (result.state === 'granted') {
          capturer.current.start()
        }

        result.onchange = function () {
          setPermission(this.state)
        }
      })
    } else {
      setPermission('prompt')
    }

    capturer.current = new PhotoCapturer(canvas.current)
    return () => {
      capturer.current.stop()
      capturer.current = null!
    }
  }, [])

  const handleStartButton = () => {
    capturer.current.start()
  }

  const capture = async () => {
    setProcessing(true)
    const blob = await capturer.current.capture()
    capturer.current.pause()
    const id = nanoid()
    try {
      const snapshot = await storage.ref(id).put(blob)
      const {
        data: { text },
      } = await functions.httpsCallable('analyser-analyse')({
        bucket: snapshot.ref.bucket,
        path: snapshot.ref.fullPath,
        id,
      })

      history.push('/add-medication', { id })
    } finally {
      setProcessing(false)
      capturer.current?.play()
    }
  }

  return (
    <div className={cs('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center', 'bg-brand-secondary')}>
      <div className={cs('p-4', 'w-full')}>
        <Square className={cs('w-full')}>
          <div
            className={cs(
              'w-full',
              'border-2',
              'border-white',
              'bg-brand-white',
              'text-brand-primary',
              'rounded-lg',
              'overflow-hidden',
              'h-full',
              'relative',
            )}
          >
            <canvas ref={canvas} className={cs(styles.canvas)}></canvas>
            {permission === 'prompt' ? (
              <button
                onClick={handleStartButton}
                className={cs(
                  'absolute',
                  'top-0',
                  'right-o',
                  'w-full',
                  'h-full',
                  'flex',
                  'items-center',
                  'justify-center',
                )}
              >
                <div>
                  <i className={cs('fas', 'fa-camera', 'text-3xl')}></i>
                  <br />
                  Tap to activate camera.
                </div>
              </button>
            ) : null}
            {permission === 'denied' ? (
              <button
                onClick={handleStartButton}
                className={cs(
                  'absolute',
                  'top-0',
                  'right-o',
                  'w-full',
                  'h-full',
                  'flex',
                  'items-center',
                  'justify-center',
                )}
              >
                <div style={{ maxWidth: '70%' }} className={cs('pt-12')}>
                  <i className={cs('fas', 'fa-camera', 'text-3xl')}></i>
                  <br />
                  Camera access was blocked. Please enable camera access in your browser settings
                </div>
              </button>
            ) : null}
            {processing ? (
              <div
                className={cs(
                  styles.overlay,
                  'absolute',
                  'top-0',
                  'right-o',
                  'w-full',
                  'h-full',
                  'flex',
                  'items-center',
                  'justify-center',
                  'rounded-lg',
                )}
              >
                <p className={cs('text-lg')}>Scanning...</p>
              </div>
            ) : null}
          </div>
        </Square>
      </div>
      <div>
        <p>Place the prescription label within the frame.</p>
      </div>
      {permission === 'granted' ? (
        <div className={cs('fixed', 'bottom-0', 'left-0', 'right-0', 'flex', 'justify-center', 'pb-8')}>
          <Button onClick={capture} invert>
            Scan
          </Button>
        </div>
      ) : null}

      {result ? (
        <div
          className={cs(
            styles.overlay,
            'fixed',
            'top-0',
            'right-0',
            'bottom-0',
            'left-0',
            'flex',
            'flex-col',
            'justify-center',
            'items-center',
          )}
        >
          <pre className={cs('text-mono', 'text-xs', 'max-w-full', 'max-h-full', 'overflow-auto')}>
            <CopyText text={result} />
          </pre>
          <div className={cs('fixed', 'bottom-0', 'left-0', 'right-0', 'flex', 'justify-center', 'pb-8')}>
            <Button onClick={() => setResult(null)} invert>
              Done
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  const copy = () => {
    clipboardy.write(text)
    setCopied(true)
  }

  return <span onClick={copy}>{copied ? 'Copied to clipboard' : text}</span>
}
