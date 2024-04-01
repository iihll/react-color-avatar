import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarOption } from '../types'
import { getRandomAvatarOption } from '../utils'
import { SCREEN } from '../utils/constant'
import { WrapperShape } from '../enums'
import {
  REDO,
  SET_AVATAR_OPTION,
  SET_SIDER_STATUS,
  UNDO,
} from './mutation-type'

export interface State {
  history: {
    past: AvatarOption[]
    present: AvatarOption
    future: AvatarOption[]
  }
  isSiderCollapsed: boolean
}

const initialState: State = {
  history: {
    past: [],
    present: getRandomAvatarOption({ wrapperShape: WrapperShape.Squircle }),
    future: [],
  },
  isSiderCollapsed: window.innerWidth <= SCREEN.lg,
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    [SET_AVATAR_OPTION]: (state, { payload }: PayloadAction<AvatarOption>) => {
      state.history = {
        past: [...state.history.past, state.history.present],
        present: payload,
        future: [],
      }
    },
    [UNDO]: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1]
        const newPast = state.history.past.slice(0, state.history.past.length - 1)
        state.history = {
          past: newPast,
          present: previous,
          future: [state.history.present, ...state.history.future],
        }
      }
    },
    [REDO]: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[0]
        const newFuture = state.history.future.slice(1)
        state.history = {
          past: [...state.history.past, state.history.present],
          present: next,
          future: newFuture,
        }
      }
    },
    [SET_SIDER_STATUS]: (state, { payload }: PayloadAction<boolean>) => {
      if (payload !== state.isSiderCollapsed) {
        state.isSiderCollapsed = payload
      }
    },
  }
})

export const globalActions = globalSlice.actions

export const store = configureStore({
  reducer: {
    global: globalSlice.reducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()