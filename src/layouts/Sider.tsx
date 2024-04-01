import { PropsWithChildren } from "react";
import IconRight from '@/assets/icons/icon-right.svg'
import useSider from '@/hooks/useSider'
import './Sider.scss'

export default function Sider(props: PropsWithChildren) {
  const { isCollapsed, openSider, closeSider } = useSider()

  return (
    <aside className={isCollapsed ? 'sider collapsed' : 'sider'}>
      {props.children}

      <div className="trigger" onClick={isCollapsed ? openSider : closeSider}>
        <img src={IconRight} className="icon-right" alt="arrow" />
      </div>
    </aside>
  )
}