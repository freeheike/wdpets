import { useState, useEffect } from 'react'

export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  }
}

export function usePetSize() {
  const { width } = useBreakpoint()
  if (width < 380) return 88
  if (width < 640) return 100
  if (width < 1024) return 110
  return 120
}
