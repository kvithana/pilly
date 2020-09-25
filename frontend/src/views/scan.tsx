import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/button'
import { cs } from '../cs'
import { functions, storage } from '../firebase'
import styles from './scan.module.css'
import { nanoid } from 'nanoid'

class PhotoCapturer {
  video: HTMLVideoElement
  canvas: HTMLCanvasElement
  rafId: number = -1
  playing: boolean = false
  size: number = 0
  stream: MediaStream | undefined
  paused: boolean = false

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
    let offsetX = 0.5 * (this.video.videoWidth - this.size)
    let offsetY = 0.5 * (this.video.videoHeight - this.size)
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
  const canvas = useRef<HTMLCanvasElement>(null!)
  const capturer = useRef<PhotoCapturer>(null!)
  const [permission, setPermission] = useState<PermissionState | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)

  useEffect(() => {
    capturer.current = new PhotoCapturer(canvas.current)

    if (navigator?.permissions?.query) {
      navigator.permissions.query({ name: 'camera' }).then((result) => {
        setPermission(result.state)
        if (result.state === 'granted') {
          start()
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

  const start = useCallback(() => {
    capturer.current.start()
  }, [])

  const capture = async () => {
    setProcessing(true)
    const blob = await capturer.current.capture()
    capturer.current.pause()
    const id = nanoid()
    await storage.ref(id).put(blob)
    await functions.httpsCallable('analyser-analyse')({ id })
    setProcessing(false)
    capturer.current.play()
  }

  return (
    <div className={cs('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center')}>
      <div className={cs('p-4')}>
        <div className={cs('w-full', 'border-2', 'border-black', 'rounded-lg', 'overflow-hidden')}>
          <canvas ref={canvas} className={cs(styles.canvas)}></canvas>
        </div>
      </div>
      <div>
        <p>Place the prescription label within the frame.</p>
      </div>
      {permission === 'prompt' ? <button onClick={start}>Start</button> : null}
      <div className={cs('fixed', 'bottom-0', 'left-0', 'right-0', 'flex', 'justify-center', 'pb-8')}>
        <Button onClick={capture}>Scan</Button>
      </div>
      {processing ? (
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
          <p className={cs('text-lg')}>Processing</p>
        </div>
      ) : null}
    </div>
  )
}
