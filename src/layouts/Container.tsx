import useSider from "@/hooks/useSider";
import { SCREEN } from "@/utils/constant";
import { PropsWithChildren, useEffect } from "react";
import './Container.scss'

export default function Container(props: PropsWithChildren) {
const { isCollapsed, openSider, closeSider } = useSider()

  function handleWindowResize() {
    if (window.innerWidth <= SCREEN.lg) {
      closeSider()
    } else {
      openSider()
    }
  }

  useEffect(() => {
    void (function () {
      const throttle = function (
        type: string,
        customEventName: string,
        obj: Window
      ) {
        obj = obj || window
        let running = false
        const func = () => {
          if (running) {
            return
          }
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
    <section className={isCollapsed ? 'container full' : 'container'}>
      {props.children}
    </section>
  )
}