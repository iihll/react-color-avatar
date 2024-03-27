'use client'
import { type PropsWithChildren, useEffect } from 'react'
import useSider from '@/hooks/useSider'
import { SCREEN } from '@/utils/constant'

export default function Container({ children }: PropsWithChildren) {
  const { isCollapsed, openSider, closeSider } = useSider()
  function handleWindowResize() {
    if (window.innerWidth <= SCREEN.lg)
      closeSider()
    else
      openSider()
  }
  useEffect(() => {
    void (function () {
      const throttle = function (
        type: string,
        customEventName: string,
        obj: Window,
      ) {
        obj = obj || window
        let running = false
        const func = () => {
          if (running)
            return

          running = true
          requestAnimationFrame(() => {
            obj.dispatchEvent(new CustomEvent(customEventName))
            running = false
          })
        }
        obj.addEventListener(type, func)
      }
      throttle('resize', 'optimizedResize', window)
    })()

    window.addEventListener('optimizedResize', handleWindowResize)

    return () => {
      window.removeEventListener('optimizedResize', handleWindowResize)
    }
  }, [])

  return (
    <section className={isCollapsed ? 'h-full pr-0' : 'h-full pr-80'}>
      {children}
    </section>
  )
}
