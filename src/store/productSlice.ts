import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '.'
import SelectedBond from '@/types/SelectedBond'


// Define a type for the slice state
interface ProductState {
  bond: SelectedBond | null
}

// Define the initial state using that type
const initialState: ProductState = {
  bond: null
}

export const ProductSlice = createSlice({
  name: 'Product',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<SelectedBond | null>) => {
      state.bond = action.payload
    },
  },
})

export const { setProduct } = ProductSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const Product = (state: RootState) => state.selectedBond

export default ProductSlice.reducer