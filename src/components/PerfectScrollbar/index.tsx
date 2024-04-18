import { default as _PerfectScrollbar } from 'perfect-scrollbar'
import { PropsWithChildren, useEffect, useRef } from 'react';
import './index.scss'

interface Props {
  options?: _PerfectScrollbar.Options
  className?: string
}
let ps: _PerfectScrollbar

export default function PerfectScrollbar(props: PropsWithChildren<Props>) {
  const scrollWrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollWrapper.current) {
      console.warn(`No valid 'PerfectScrollbar' container found`)
      return
    }
  
    ps = new _PerfectScrollbar(scrollWrapper.current, {
      minScrollbarLength: 20,
      maxScrollbarLength: 160,
      ...props.options,
    })

    return () => {
      ps.destroy()
    }
  }, [props.options])

  return (
    <div ref={scrollWrapper} className={props.className} style={{ position: 'relative', overflow: 'hidden' }}>
      {props.children}
    </div>
  )
}