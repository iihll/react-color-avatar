import { useAppDispatch, useAppSelector, globalActions } from '@/store'
import { SET_SIDER_STATUS } from '@/store/mutation-type'

export default function useSider() {
  const isCollapsed = useAppSelector(state => state.global.isSiderCollapsed)
  const dispatch = useAppDispatch()

  const openSider = () => {
    dispatch(globalActions[SET_SIDER_STATUS](false))
  }

  const closeSider = () => {
    dispatch(globalActions[SET_SIDER_STATUS](true))

  }

  return { isCollapsed, openSider, closeSider }
}
