import { useEffect, useRef } from 'react'

const DetectCopies = () => {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    document.addEventListener('copy', async () => {
      try {
        const clipboardText = await navigator.clipboard.readText()
        console.log('Copied content:', clipboardText)
      } catch (err) {
        console.log('Clipboard read failed:', err)
      }
    })

    return () => {
      document.removeEventListener('copy', () => {
        console.log('Copy event removed')
      })
    }
  }, [])

  return <></>
}

export default DetectCopies
