import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isTablet, setIsTablet] = React.useState<boolean>(false)
  const [isTouchDevice, setIsTouchDevice] = React.useState<boolean>(false)
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Enhanced mobile detection
      const isMobileDevice = width < MOBILE_BREAKPOINT || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      const isTabletDevice = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT
      
      // Touch device detection
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Orientation detection
      const currentOrientation = width > height ? 'landscape' : 'portrait'
      
      setIsMobile(isMobileDevice)
      setIsTablet(isTabletDevice)
      setIsTouchDevice(hasTouchSupport)
      setOrientation(currentOrientation)
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const orientationMql = window.matchMedia('(orientation: landscape)')
    
    const onChange = updateDeviceInfo
    const onOrientationChange = updateDeviceInfo
    
    mql.addEventListener("change", onChange)
    orientationMql.addEventListener("change", onOrientationChange)
    window.addEventListener('resize', updateDeviceInfo)
    
    updateDeviceInfo()
    
    return () => {
      mql.removeEventListener("change", onChange)
      orientationMql.removeEventListener("change", onOrientationChange)
      window.removeEventListener('resize', updateDeviceInfo)
    }
  }, [])

  return {
    isMobile: !!isMobile,
    isTablet,
    isTouchDevice,
    orientation,
    isSmallScreen: isMobile || isTablet
  }
}
