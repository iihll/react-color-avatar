import { useState } from 'react'

export default function useSider() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const openSider = () => {
    setIsCollapsed(false)
  }

  const closeSider = () => {
    setIsCollapsed(true)
  }

  return { isCollapsed, openSider, closeSider }
}
