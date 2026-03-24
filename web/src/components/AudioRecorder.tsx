import { useRef, useState, useCallback } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      data-testid="btn-record-audio"
      className={recording ? "animate-pulse" : "text-muted-foreground hover:text-foreground"}
    >
      {recording ? (
        <MicOff className="size-5 text-red-500" />
      ) : (
        <Mic className="size-5" />
      )}
    </Button>
  )
}
