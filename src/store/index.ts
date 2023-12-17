import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import contextReducer from './contextSlice'
import productSlice from './productSlice'
import ClientSlice from './ClientSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    context: contextReducer,
    selectedBond: productSlice,
    selectedClient: ClientSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch