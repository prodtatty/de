declare module 'mp4box' {
  export interface MP4MediaTrack {
    id: number
    created: Date
    modified: Date
    movie_duration: number
    layer: number
    alternate_group: number
    volume: number
    track_width: number
    track_height: number
    timescale: number
    duration: number
    bitrate: number
    codec: string
    language: string
    nb_samples: number
  }

  export interface MP4VideoData {
    width: number
    height: number
  }

  export interface MP4VideoTrack extends MP4MediaTrack {
    video: MP4VideoData
  }

  export type MP4Track = MP4VideoTrack | MP4MediaTrack

  export interface MP4Info {
    duration: number
    timescale: number
    fragment_duration?: number
    isFragmented: boolean
    isProgressive: boolean
    hasIOD: boolean
    brands: string[]
    created: Date
    modified: Date
    tracks: MP4Track[]
    mime: string
  }

  export interface MP4Sample {
    number: number
    track_id: number
    timescale: number
    description_index: number
    description: unknown
    data: Uint8Array
    size: number
    alreadyRead: number
    duration: number
    cts: number
    dts: number
    is_sync: boolean
    is_leading: number
    depends_on: number
    is_depended_on: number
    has_redundancy: number
    degradation_priority: number
    offset: number
  }

  export interface MP4ArrayBuffer extends ArrayBuffer {
    fileStart: number
  }

  export interface MP4File {
    onMoovStart?: () => void
    onReady?: (info: MP4Info) => void
    onError?: (e: string) => void
    onSamples?: (track_id: number, ref: unknown, samples: MP4Sample[]) => void

    appendBuffer(data: MP4ArrayBuffer): number
    start(): void
    stop(): void
    flush(): void
    setExtractionOptions(
      track_id: number,
      user?: unknown,
      options?: { nbSamples?: number; rapAlignement?: boolean },
    ): void
    getTrackById(id: number): MP4Track | undefined
    releaseUsedSamples(track_id: number, sampleNumber: number): void

    // Used to build codec-specific decoder configuration description
    moov?: {
      traks: Array<{
        mdia: {
          minf: {
            stbl: {
              stsd: {
                entries: Array<Record<string, unknown>>
              }
            }
          }
        }
      }>
    }
  }

  export function createFile(): MP4File

  export class DataStream {
    static readonly BIG_ENDIAN: boolean
    static readonly LITTLE_ENDIAN: boolean
    constructor(buffer?: ArrayBuffer, byteOffset?: number, endianness?: boolean)
    buffer: ArrayBuffer
  }
}
