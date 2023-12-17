import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '.'


// Define a type for the slice state
interface ClientState {
  client: string | null
}

// Define the initial state using that type
const initialState: ClientState = {
  client: null
}

export const ClientSlice = createSlice({
  name: 'Client',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setClient: (state, action: PayloadAction<string | null>) => {
      state.client = action.payload
    },
  },
})

export const { setClient } = ClientSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const Client = (state: RootState) => state.selectedClient

export default ClientSlice.reducer