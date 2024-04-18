import { PropsWithChildren } from 'react';
import './index.scss'

export default function SectionWrapper(props: PropsWithChildren<{title?: string}>) {
  return (
    <div className="setting-section">
      <div className="section-title">{props.title}</div>
      <div>
        {props.children}
      </div>
    </div>
  )
}