import { useAppDispatch, useAppSelector, globalActions } from '@/store'
import { SET_AVATAR_OPTION } from '@/store/mutation-type'
import type { AvatarOption } from '@/types'

export default function useAvatarOption() {
  const avatarOption = useAppSelector(state => state.global.history.present)
  const dispatch = useAppDispatch()

  const setAvatarOption = (newOption: AvatarOption) => {
    dispatch(globalActions[SET_AVATAR_OPTION](newOption))
  }

  return [avatarOption, setAvatarOption] as const
}
