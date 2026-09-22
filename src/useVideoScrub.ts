import { useEffect, useRef, useState } from 'react'
import * as MP4Box from 'mp4box'
import type { MP4File, MP4Sample, MP4VideoTrack, MP4ArrayBuffer } from 'mp4box'

const LERP_TAU = 8
const SNAP = 0.002
const LRU_MAX = 24
const LEAD = 24
const WATCHDOG = 60000

interface BankEntry {
  ts: number // microseconds
  blob: Blob
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getDescription(mp4boxFile: MP4File, trackId: number): Uint8Array {
  const traks = mp4boxFile.moov?.traks ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trak = (traks as any[]).find((t) => t.tkhd?.track_id === trackId)
  const entry = trak?.mdia?.minf?.stbl?.stsd?.entries?.[0]
  const box = entry?.avcC || entry?.hvcC || entry?.vpcC || entry?.av1C
  if (!box) {
    throw new Error('avcC, hvcC, vpcC, or av1C box not found')
  }
  const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN)
  box.write(stream)
  return new Uint8Array(stream.buffer, 8)
}

interface DecodeCallbacks {
  onFirstFrame: () => void
}

function decodeWithMP4Box(
  buffer: ArrayBuffer,
  hwAccel: HardwareAcceleration,
  bank: BankEntry[],
  callbacks: DecodeCallbacks,
  registerDecoder: (d: VideoDecoder | null) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const mp4boxFile = MP4Box.createFile()
    let decoder: VideoDecoder | null = null
    let videoTrackId = -1
    let finished = false
    let framesOutput = 0
    let blobsCreated = 0
    let decodeFlushed = false
    let totalSamplesSeen = 0
    let expectedSamples = -1
    let extractionComplete = false
    let flushRequested = false

    const sampleQueue: MP4Sample[] = []

    const offscreen = document.createElement('canvas')
    const offCtx = offscreen.getContext('2d')

    const finish = (err?: Error) => {
      if (finished) return
      finished = true
      registerDecoder(null)
      try {
        decoder?.close()
      } catch {
        /* already closed */
      }
      if (err) reject(err)
      else resolve()
    }

    const checkDone = () => {
      if (decodeFlushed && blobsCreated >= framesOutput) {
        bank.sort((a, b) => a.ts - b.ts)
        finish()
      }
    }

    const pumpDecode = () => {
      if (!decoder || decoder.state !== 'configured') return
      while (sampleQueue.length > 0) {
        const backlog = framesOutput - blobsCreated + decoder.decodeQueueSize
        if (backlog >= LEAD) break
        const sample = sampleQueue.shift()!
        const chunk = new EncodedVideoChunk({
          type: sample.is_sync ? 'key' : 'delta',
          timestamp: (sample.cts / sample.timescale) * 1e6,
          duration: (sample.duration / sample.timescale) * 1e6,
          data: sample.data,
        })
        decoder.decode(chunk)
      }
      if (sampleQueue.length > 0) {
        setTimeout(pumpDecode, 0)
      } else if (extractionComplete && !flushRequested) {
        flushRequested = true
        decoder
          .flush()
          .then(() => {
            decodeFlushed = true
            checkDone()
          })
          .catch((e) => finish(e instanceof Error ? e : new Error(String(e))))
      }
    }

    const handleFrame = (frame: VideoFrame) => {
      framesOutput++
      const ts = frame.timestamp
      if (!offCtx) {
        frame.close()
        return
      }
      offscreen.width = frame.displayWidth
      offscreen.height = frame.displayHeight
      offCtx.drawImage(frame, 0, 0)
      frame.close()
      offscreen.toBlob(
        (blob) => {
          blobsCreated++
          if (blob) {
            const isFirst = bank.length === 0
            bank.push({ ts, blob })
            if (isFirst) callbacks.onFirstFrame()
          }
          checkDone()
        },
        'image/webp',
        0.82,
      )
    }

    mp4boxFile.onError = (e) => finish(new Error(String(e)))

    mp4boxFile.onReady = (info) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const track = info.tracks.find((t) => (t as any).video) as MP4VideoTrack | undefined
      if (!track) {
        finish(new Error('no video track found'))
        return
      }
      videoTrackId = track.id
      expectedSamples = track.nb_samples

      let description: Uint8Array
      try {
        description = getDescription(mp4boxFile, track.id)
      } catch (e) {
        finish(e instanceof Error ? e : new Error(String(e)))
        return
      }

      decoder = new VideoDecoder({
        output: (frame) => {
          handleFrame(frame)
          pumpDecode()
        },
        error: (e) => finish(e instanceof Error ? e : new Error(String(e))),
      })
      registerDecoder(decoder)

      decoder.configure({
        codec: track.codec,
        codedWidth: track.video.width,
        codedHeight: track.video.height,
        description,
        hardwareAcceleration: hwAccel,
      })

      mp4boxFile.setExtractionOptions(videoTrackId, undefined, { nbSamples: 200 })
      mp4boxFile.start()
    }

    mp4boxFile.onSamples = (_trackId, _ref, samples) => {
      totalSamplesSeen += samples.length
      sampleQueue.push(...samples)
      if (expectedSamples > 0 && totalSamplesSeen >= expectedSamples) {
        extractionComplete = true
      }
      mp4boxFile.releaseUsedSamples(videoTrackId, samples[samples.length - 1].number)
      pumpDecode()
    }

    const mp4Buffer = buffer as MP4ArrayBuffer
    mp4Buffer.fileStart = 0
    try {
      mp4boxFile.appendBuffer(mp4Buffer)
      mp4boxFile.flush()
    } catch (e) {
      finish(e instanceof Error ? e : new Error(String(e)))
      return
    }

    if (videoTrackId === -1) {
      finish(new Error('no video track found'))
    }
  })
}

export function useVideoScrub(videoSrc: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [canvasLive, setCanvasLive] = useState(false)

  const bankRef = useRef<BankEntry[]>([])
  const lruRef = useRef<Map<number, ImageBitmap | null>>(new Map())
  const currentRef = useRef(0)
  const targetRef = useRef(0)
  const readyRef = useRef(false)
  const canvasLiveRef = useRef(false)
  const revertedRef = useRef(false)
  const buildingRef = useRef(false)
  const durRef = useRef(0)
  const spanRef = useRef(0)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number | null>(null)
  const decoderRef = useRef<VideoDecoder | null>(null)

  useEffect(() => {
    const updateSpan = () => {
      const container = containerRef.current
      if (container) {
        spanRef.current = container.offsetHeight - window.innerHeight
      }
    }
    updateSpan()
    window.addEventListener('resize', updateSpan)
    window.addEventListener('orientationchange', updateSpan)
    return () => {
      window.removeEventListener('resize', updateSpan)
      window.removeEventListener('orientationchange', updateSpan)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onLoadedMetadata = () => {
      durRef.current = video.duration || 0
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    if (video.duration && !Number.isNaN(video.duration)) {
      durRef.current = video.duration
    }

    const getProgress = () => {
      const span = spanRef.current
      if (span <= 0) return 0
      return Math.min(1, Math.max(0, window.scrollY / span))
    }

    const nearestIndex = (t: number): number => {
      const bank = bankRef.current
      if (bank.length === 0) return -1
      const target = t * 1e6
      let lo = 0
      let hi = bank.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (bank[mid].ts < target) lo = mid + 1
        else hi = mid
      }
      if (lo > 0) {
        const prevDiff = Math.abs(bank[lo - 1].ts - target)
        const currDiff = Math.abs(bank[lo].ts - target)
        if (prevDiff < currDiff) return lo - 1
      }
      return lo
    }

    const warmLRU = (centerIndex: number) => {
      const bank = bankRef.current
      const lru = lruRef.current
      const indices = [centerIndex - 1, centerIndex, centerIndex + 1, centerIndex + 2].filter(
        (i) => i >= 0 && i < bank.length,
      )
      for (const i of indices) {
        if (lru.has(i)) {
          const bmp = lru.get(i) ?? null
          lru.delete(i)
          lru.set(i, bmp)
          continue
        }
        lru.set(i, null)
        const entry = bank[i]
        createImageBitmap(entry.blob)
          .then((bitmap) => {
            if (!bankRef.current[i]) {
              bitmap.close()
              return
            }
            lru.delete(i)
            lru.set(i, bitmap)
            while (lru.size > LRU_MAX) {
              const oldestKey = lru.keys().next().value
              if (oldestKey === undefined) break
              const oldBmp = lru.get(oldestKey)
              oldBmp?.close()
              lru.delete(oldestKey)
            }
          })
          .catch(() => {
            lru.delete(i)
          })
      }
    }

    const drawNearestFrame = (t: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const idx = nearestIndex(t)
      if (idx < 0) return
      warmLRU(idx)
      const bmp = lruRef.current.get(idx)
      if (bmp) {
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
      }
    }

    const loop = (t: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = t
      const dt = Math.min(0.1, (t - lastTimeRef.current) / 1000)
      lastTimeRef.current = t

      const p = getProgress()
      setScrollProgress(p)

      const dur = durRef.current
      if (dur > 0) {
        targetRef.current = p * dur
        if (prefersReducedMotion()) {
          currentRef.current = targetRef.current
        } else {
          const diff = targetRef.current - currentRef.current
          currentRef.current += diff * (1 - Math.exp(-dt * LERP_TAU))
          if (Math.abs(targetRef.current - currentRef.current) < SNAP) {
            currentRef.current = targetRef.current
          }
        }

        if (readyRef.current) {
          drawNearestFrame(currentRef.current)
        } else if (!revertedRef.current) {
          if (!video.seeking && Math.abs(video.currentTime - currentRef.current) > 0.01) {
            video.currentTime = currentRef.current
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const buildFrameBank = async () => {
      if (buildingRef.current) return
      buildingRef.current = true

      let watchdogId: number | undefined
      const watchdog = new Promise<never>((_, reject) => {
        watchdogId = window.setTimeout(() => reject(new Error('decode watchdog timeout')), WATCHDOG)
      })

      try {
        if (prefersReducedMotion() || typeof VideoDecoder === 'undefined') {
          throw new Error('frame-bank decoding unavailable')
        }

        const response = await fetch(videoSrc)
        if (!response.ok) throw new Error(`fetch failed: ${response.status}`)
        const buffer = await response.arrayBuffer()

        const onFirstFrame = () => {
          readyRef.current = true
          if (!canvasLiveRef.current) {
            canvasLiveRef.current = true
            setCanvasLive(true)
          }
        }

        const attempt = (async () => {
          try {
            await decodeWithMP4Box(buffer, 'prefer-hardware', bankRef.current, { onFirstFrame }, (d) => {
              decoderRef.current = d
            })
          } catch (err) {
            console.warn('[useVideoScrub] hardware decode failed, retrying with software decode', err)
            bankRef.current.length = 0
            readyRef.current = false
            canvasLiveRef.current = false
            setCanvasLive(false)
            await decodeWithMP4Box(buffer, 'prefer-software', bankRef.current, { onFirstFrame }, (d) => {
              decoderRef.current = d
            })
          }
        })()

        await Promise.race([attempt, watchdog])
      } catch (err) {
        console.warn('[useVideoScrub] frame bank build failed, falling back to video element seeking', err)
        revertedRef.current = true
        readyRef.current = false
        canvasLiveRef.current = false
        setCanvasLive(false)
      } finally {
        if (watchdogId !== undefined) window.clearTimeout(watchdogId)
        buildingRef.current = false
      }
    }

    const startBuilding = () => {
      buildFrameBank()
    }
    if (document.readyState === 'complete') {
      startBuilding()
    } else {
      window.addEventListener('load', startBuilding, { once: true })
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      window.removeEventListener('load', startBuilding)
      try {
        decoderRef.current?.close()
      } catch {
        /* already closed */
      }
      for (const bmp of lruRef.current.values()) {
        bmp?.close()
      }
      lruRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc])

  return { videoRef, canvasRef, containerRef, scrollProgress, canvasLive }
}
