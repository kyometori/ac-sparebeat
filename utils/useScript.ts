import { useEffect } from 'react'

export const useScript = (url: string, callback: () => unknown) => {
  useEffect(() => {
    const script = document.createElement("script")

    script.onload = callback

    script.src = url
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [url])
}
