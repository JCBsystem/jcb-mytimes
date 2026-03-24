import { useRef, useState, useCallback } from "react"
import { Mic, Square } from "lucide-react"

interface AudioRecorderProps {
  onRecorded: (audioBase64: string, contentType: string) => void
}

export function AudioRecorder({ onRecorded }: AudioRecorderProps) {
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : ""
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType,
        })
        const reader = new FileReader()
        reader.onloadend = () => {
          const dataUrl = reader.result as string
          const base64 = dataUrl.split(",")[1]
          onRecorded(base64, recorder.mimeType)
        }
        reader.readAsDataURL(blob)
        stopStream()
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
    } catch (err) {
      console.error("Failed to start recording:", err)
      stopStream()
    }
  }, [onRecorded, stopStream])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
  }, [])

  const toggle = useCallback(() => {
    if (recording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [recording, startRecording, stopRecording])

  if (recording) {
    return (
      <button
        onClick={toggle}
        data-testid="btn-record-audio"
        className="relative flex items-center justify-center w-10 h-10 rounded-full"
      >
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 border-r-red-300 animate-spin" />
        {/* Pulsing glow */}
        <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />
        {/* Stop icon */}
        <Square className="size-4 text-red-500 fill-red-500 relative z-10" />
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      data-testid="btn-record-audio"
      className="flex items-center justify-center w-10 h-10 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
    >
      <Mic className="size-5" />
    </button>
  )
}
