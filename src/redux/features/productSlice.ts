  "use client"
import top_product from '@/data/top_product';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 

interface Product {
  id: number;
  // Add other properties of your product here
}

interface ProductState {
  products: Product[] | any[];
  product: Product | {};
}

const initialState: ProductState = {
  products: top_product,
  product: {},
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    single_product: (state, action: PayloadAction<number>) => {
      state.product = state.products.find((p) => Number(p.id) === Number(action.payload)) || {};
    },
  },
});

export const { single_product } = productSlice.actions;

// Selectors
export const selectProducts = (state: { products: ProductState }) => state?.products?.products;
export const selectProduct = (state: { products: ProductState }) => state?.products?.product;

export default productSlice.reducer;

